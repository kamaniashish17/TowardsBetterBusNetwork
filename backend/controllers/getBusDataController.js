const mongoose = require("mongoose");
const path = require("path");
const CHUNK_SIZE = 100;

const BusRoutes = require("../models/BusRoutes");
const BusStops = require("../models/BusStops");
const BusTrips = require("../models/BusTrip");

let SourceStopName;
let DestinationStopName;
let Source_Stop_Id;
let Destination_Stop_Id;
let Source_Stop_Routes;
let Destination_Stop_Routes;
let RadarData;
let routesWithStops;

let zoneData = {
  "Zone 1": {
    totalCount: 0,
    totalLength: 0,
    totalStops: 0,
    totalConstructionCost: 0,
    totalServiceCost: 0,
  },
  "Zone 2": {
    totalCount: 0,
    totalLength: 0,
    totalStops: 0,
    totalConstructionCost: 0,
    totalServiceCost: 0,
  },
  "Zone 3": {
    totalCount: 0,
    totalLength: 0,
    totalStops: 0,
    totalConstructionCost: 0,
    totalServiceCost: 0,
  },
  "Zone 4": {
    totalCount: 0,
    totalLength: 0,
    totalStops: 0,
    totalConstructionCost: 0,
    totalServiceCost: 0,
  },
};
async function getBusRoutesDataController(req, res) {
  //console.log("Inside getBusRoutesDataController");
  try {

      const { Source, Destination } = req.query; //.query;

      console.log("Source:", Source);
      console.log("Destination:", Destination);

      const sourceStops = await BusStops.find({ StopName: Source });
      const destinationStops = await BusStops.find({ StopName: Destination });

      if (sourceStops.length === 0) {
          return res.status(404).json({
              message: "Source Stops not found in the database"
          });
      }
      if (destinationStops.length === 0) {
          return res.status(404).json({
              message: "Destination Stops not found in the database"
          });
      }


      let SourceStopNames = sourceStops.map(stop => stop.StopName);
      let DestinationStopNames = destinationStops.map(stop => stop.StopName);
      let Source_Stop_Ids = sourceStops.map(stop => stop.StopCode);
      let Destination_Stop_Ids = destinationStops.map(stop => stop.StopCode);
      let Source_Stop_Routes = sourceStops.flatMap(stop => stop.Routes);
      let Destination_Stop_Routes = destinationStops.flatMap(stop => stop.Routes);
      let uniqueSourceStopRoutes = new Set(Source_Stop_Routes);
      let uniqueDestinationStopRoutes = new Set(Destination_Stop_Routes);
      let intersectionRoutes = new Set([...uniqueSourceStopRoutes].filter(x => uniqueDestinationStopRoutes.has(x)));
      let SourceLatitudes = sourceStops.map(stop => stop.Latitude); 
      let DestinationLatitudes = destinationStops.map(stop => stop.Latitude);
      let directionIndicator = DestinationLatitudes[0] > SourceLatitudes[0] ? "U" : "D";
      let direction = directionIndicator === "U" ? "UP" : "Down";


      if (direction === "UP") 
      {
          intersectionRoutes = new Set([...intersectionRoutes].filter(route => route.includes('U')));
      }
      else
      {
          intersectionRoutes = new Set([...intersectionRoutes].filter(route => route.includes('D')));

      }

      // console.log("=============================================================");
      // console.log("Source Stop Names:", SourceStopNames.join(", "));  
      // console.log("Destination Stop Names:", DestinationStopNames.join(", "));
      // console.log("Source Stop IDs:", Source_Stop_Ids.join(", "));
      // //console.log("Source Stop IDs:", Source_Stop_Ids);
      // console.log("Destination Stop IDs:", Destination_Stop_Ids.join(", "));
      // //console.log("Source Stop Routes (all):", Source_Stop_Routes.join(", "));
      // console.log("Unique Source Stop Routes:", Array.from(uniqueSourceStopRoutes).join(", "));
      // //console.log("Destination Stop Routes (all):", Destination_Stop_Routes.join(", "));
      // console.log("Unique Destination Stop Routes:", Array.from(uniqueDestinationStopRoutes).join(", "));
      // console.log("Direction from Source to Destination:", direction);
      // console.log("Intersection of Routes:", Array.from(intersectionRoutes).join(", "));
      // //console.log("Intersection of Routes:", intersectionRoutes);
      // console.log("=============================================================");

      // console.log("Routes from all Source Stops:", sourceStops.map(stop => stop.Routes));
      // console.log("Routes from all Destination Stops:", destinationStops.map(stop => stop.Routes));

      let filteredSourceStopIds = Source_Stop_Ids.filter(id => {
          let routePart = id.split('-').slice(0, 2).join('-');
          return intersectionRoutes.has(routePart);
      });
      
      let filteredDestinationStopIds = Destination_Stop_Ids.filter(id => {
          let routePart = id.split('-').slice(0, 2).join('-');
          return intersectionRoutes.has(routePart);
      });
      
      filteredSourceStopIds.sort();
      filteredDestinationStopIds.sort();
      // console.log("*****************************************************");
      // console.log("Filtered Source Stop IDs:", filteredSourceStopIds.sort());
      // console.log("Filtered Destination Stop IDs:", filteredDestinationStopIds.sort());
      // console.log("*****************************************************");

      let IntersectionRoutesArray=Array.from(intersectionRoutes).sort();
      routesWithStops = IntersectionRoutesArray.map((routeId, index) => ({
          RouteId: routeId,
          SourceStop: filteredSourceStopIds[index],
          DestinationStop: filteredDestinationStopIds[index]
      }));

      //console.log("Routes with Stops:", routesWithStops);
      
      const routeIds = routesWithStops.map(item => item.RouteId);
      const routeAccessConditions = routeIds;

      // Query the database for the specified fields and conditions
      const busRoutes = await BusRoutes.find({
          RouteAccess: { $in: routeAccessConditions }
      }, 'RouteAccess ConstructionCost ServiceCost TotalLength NumberofStops StopCoordinateMap');

      //console.log("Bus Routes:", busRoutes);  


      let mergedRoutes = routesWithStops.map(route => {
          // Find the matching route data from busRoutes
          let matchingRoute = busRoutes.find(busRoute => busRoute.RouteAccess === route.RouteId);
      
          // If a matching route is found, merge the data
          if (matchingRoute) {
              return {
                  RouteId: route.RouteId,
                  SourceStop: route.SourceStop,
                  DestinationStop: route.DestinationStop,
                  ServiceCost: matchingRoute.ServiceCost,
                  ConstructionCost: matchingRoute.ConstructionCost,
                  TotalLength: matchingRoute.TotalLength,
                  NumberofStops: matchingRoute.NumberofStops,
                  StopCoordinateMap: matchingRoute.StopCoordinateMap
              };
          } else {
              // If no matching route is found, just return the initial data
              return route;
          }
      });




      //console.log("Merged Routes:", mergedRoutes);
  
      res.status(200).json({
          message: "Source and Destination Routes retrieved successfully",
          // SourceStops: sourceStops.map(stop => ({
          //     StopName: stop.StopName,
          //     Routes: stop.Routes,
          //     Stop_ID: stop._id,
          //     StopCode: stop.StopCode
          // })),
          // DestinationStops: destinationStops.map(stop => ({
          //     StopName: stop.StopName,
          //     Routes: stop.Routes,
          //     Stop_ID: stop._id,
          //     StopCode: stop.StopCode
          // })),
          // IntersectionRoutes: Array.from(intersectionRoutes),
          // FilteredSourceStopIds: filteredSourceStopIds,
          // FilteredDestinationStopIds: filteredDestinationStopIds,
          //RouteDetails: routesWithStops
          data: mergedRoutes
      });
  } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({
          message: "Failed to process request",
          error: error.message
      });
  }
}


async function getBusRoutesHeatMapData(req, res) {
  try {
    const { Source, Destination } = req.query;
    console.log("request query", req.query)
    const sourceStops = await BusStops.find({ StopName: Source });
    const destinationStops = await BusStops.find({ StopName: Destination });
    if (sourceStops.length === 0) {
      return res.status(404).json({
        message: "Source Stops not found in the database",
      });
    }
    if (destinationStops.length === 0) {
      return res.status(404).json({
        message: "Destination Stops not found in the database",
      });
    }

    let Source_Stop_Ids = sourceStops.map((stop) => stop.StopCode);
    let Destination_Stop_Ids = destinationStops.map((stop) => stop.StopCode);
    let Source_Stop_Routes = sourceStops.flatMap((stop) => stop.Routes);
    let Destination_Stop_Routes = destinationStops.flatMap(
      (stop) => stop.Routes
    );
    let uniqueSourceStopRoutes = new Set(Source_Stop_Routes);
    let uniqueDestinationStopRoutes = new Set(Destination_Stop_Routes);
    let intersectionRoutes = new Set(
      [...uniqueSourceStopRoutes].filter((x) =>
        uniqueDestinationStopRoutes.has(x)
      )
    );
    let SourceLatitudes = sourceStops.map((stop) => stop.Latitude);
    let DestinationLatitudes = destinationStops.map((stop) => stop.Latitude);
    let directionIndicator =
      DestinationLatitudes[0] > SourceLatitudes[0] ? "U" : "D";
    let direction = directionIndicator === "U" ? "UP" : "Down";

    if (direction === "UP") {
      intersectionRoutes = new Set(
        [...intersectionRoutes].filter((route) => route.includes("U"))
      );
    } else {
      intersectionRoutes = new Set(
        [...intersectionRoutes].filter((route) => route.includes("D"))
      );
    }

    let filteredSourceStopIds = Source_Stop_Ids.filter((id) => {
      let routePart = id.split("-").slice(0, 2).join("-");
      return intersectionRoutes.has(routePart);
    });

    let filteredDestinationStopIds = Destination_Stop_Ids.filter((id) => {
      let routePart = id.split("-").slice(0, 2).join("-");
      return intersectionRoutes.has(routePart);
    });

    filteredSourceStopIds.sort();
    filteredDestinationStopIds.sort();

    let IntersectionRoutesArray = Array.from(intersectionRoutes).sort();
    routesWithStops = IntersectionRoutesArray.map((routeId, index) => ({
      RouteId: routeId,
      SourceStop: filteredSourceStopIds[index],
      DestinationStop: filteredDestinationStopIds[index],
    }));

    console.log("Intersection Routes Array", IntersectionRoutesArray);

    try {
      const busTripsData = await BusTrips.find(
        {
          Route_Id: { $in: IntersectionRoutesArray },
        },
        "Route_Id TimeStamp AvgCheckIn AvgCheckOut Average_Load"
      );
      res.status(200).json({
        message:
          "Heat Map Data Successfully retreived for all routes of specified source and destination",
        data: busTripsData,
      });
    } catch (err) {
      res.status(404).json({
        message:
          "Error in retreiving HeatMap data for all routes of specified source and destination",
        error: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      messgae: "Internal Server Error Occurred!!!!!",
      error: err.messgae,
    });
  }
}

async function getAllPossibleRoutesDataController(req, res) {
  try {
    const { sourceName, destinationName } = req.body;

    console.log("Source:", sourceName);
    console.log("Destination:", destinationName);
    const sourceStops = await BusStops.find({ StopName: sourceName });
    const destinationStops = await BusStops.find({ StopName: destinationName });

    if (sourceStops.length === 0) {
      return res.status(404).json({
        message: "Source Stops not found in the database",
      });
    }
    if (destinationStops.length === 0) {
      return res.status(404).json({
        message: "Destination Stops not found in the database",
      });
    }

    let SourceStopNames = sourceStops.map((stop) => stop.StopName);
    let DestinationStopNames = destinationStops.map((stop) => stop.StopName);
    let Source_Stop_Ids = sourceStops.map((stop) => stop.StopCode);
    let Destination_Stop_Ids = destinationStops.map((stop) => stop.StopCode);
    let Source_Stop_Routes = sourceStops.flatMap((stop) => stop.Routes);
    let Destination_Stop_Routes = destinationStops.flatMap(
      (stop) => stop.Routes
    );
    let uniqueSourceStopRoutes = new Set(Source_Stop_Routes);
    let uniqueDestinationStopRoutes = new Set(Destination_Stop_Routes);
    let intersectionRoutes = new Set(
      [...uniqueSourceStopRoutes].filter((x) =>
        uniqueDestinationStopRoutes.has(x)
      )
    );
    let SourceLatitudes = sourceStops.map((stop) => stop.Latitude);
    let DestinationLatitudes = destinationStops.map((stop) => stop.Latitude);
    let directionIndicator =
      DestinationLatitudes[0] > SourceLatitudes[0] ? "U" : "D";
    let direction = directionIndicator === "U" ? "UP" : "Down";

    if (direction === "UP") {
      intersectionRoutes = new Set(
        [...intersectionRoutes].filter((route) => route.includes("U"))
      );
    } else {
      intersectionRoutes = new Set(
        [...intersectionRoutes].filter((route) => route.includes("D"))
      );
    }

    let filteredSourceStopIds = Source_Stop_Ids.filter((id) => {
      let routePart = id.split("-").slice(0, 2).join("-");
      return intersectionRoutes.has(routePart);
    });

    let filteredDestinationStopIds = Destination_Stop_Ids.filter((id) => {
      let routePart = id.split("-").slice(0, 2).join("-");
      return intersectionRoutes.has(routePart);
    });

    filteredSourceStopIds.sort();
    filteredDestinationStopIds.sort();

    let IntersectionRoutesArray = Array.from(intersectionRoutes).sort();
    routesWithStops = IntersectionRoutesArray.map((routeId, index) => ({
      RouteId: routeId,
      SourceStop: filteredSourceStopIds[index],
      DestinationStop: filteredDestinationStopIds[index],
    }));

    console.log("Intersection Routes Array", IntersectionRoutesArray);

    //console.log("Routes with Stops:", routesWithStops);

    const routeIds = routesWithStops.map((item) => item.RouteId);
    const routeAccessConditions = routeIds;

    // Query the database for the specified fields and conditions
    const busRoutes = await BusRoutes.find(
      {
        RouteAccess: { $in: routeAccessConditions },
      },
      "RouteAccess ConstructionCost ServiceCost TotalLength NumberofStops StopCoordinateMap"
    );

    //console.log("Bus Routes:", busRoutes);

    let mergedRoutes = routesWithStops.map((route) => {
      // Find the matching route data from busRoutes
      let matchingRoute = busRoutes.find(
        (busRoute) => busRoute.RouteAccess === route.RouteId
      );

      // If a matching route is found, merge the data
      if (matchingRoute) {
        console.log("source Stop Id", route.SourceStop);
        console.log("destination stop Id", route.DestinationStop);

        const sourceIndex = matchingRoute.StopCoordinateMap.findIndex(
          (stop) => stop.stop_id === route.SourceStop
        );
        const destinationIndex = matchingRoute.StopCoordinateMap.findIndex(
          (stop) => stop.stop_id === route.DestinationStop
        );

        if (sourceIndex !== -1 && destinationIndex !== -1) {
          let midPoints = [];
          let restPointsAfterDestination = [];
          if (sourceIndex < destinationIndex) {
            midPoints = matchingRoute.StopCoordinateMap.slice(
              sourceIndex,
              destinationIndex + 1
            );
            restPointsAfterDestination = matchingRoute.StopCoordinateMap.slice(
              destinationIndex + 1,
              matchingRoute.StopCoordinateMap.length
            );
          } else {
            midPoints = matchingRoute.StopCoordinateMap.slice(
              destinationIndex,
              sourceIndex + 1
            );
            restPointsAfterDestination = matchingRoute.StopCoordinateMap.slice(
              0,
              destinationIndex
            );
          }
          console.log("Source Index", sourceIndex);
          console.log("Destination Index", destinationIndex);

          return {
            RouteId: route.RouteId,
            SourceStop: route.SourceStop,
            DestinationStop: route.DestinationStop,
            ServiceCost: matchingRoute.ServiceCost,
            ConstructionCost: matchingRoute.ConstructionCost,
            TotalLength: matchingRoute.TotalLength,
            NumberofStops: matchingRoute.NumberofStops,
            WayPointsCoordinateMap: midPoints,
            RestPointsCoordinateMapPostDestination: restPointsAfterDestination,
          };
        }
      } else {
        // If no matching route is found, just return the initial data
        return route;
      }
    });

    //console.log("Merged Routes:", mergedRoutes);

    res.status(200).json({
      message: "Source and Destination Routes retrieved successfully",
      data: mergedRoutes,
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({
      message: "Failed to process request",
      error: err.message,
    });
  }
}

async function getRadarDataController(req, res) {
  try {
    RadarData = await BusRoutes.find(
      {},
      "ServiceCost ConstructionCost TotalLength Zone NumberofStops"
    );

    if (RadarData.length === 0) {
      return res.status(404).json({
        message: "No bus routes data found",
      });
    }

    RadarData.forEach((row) => {
      let zone = row.Zone;
      if (zoneData.hasOwnProperty(zone)) {
        zoneData[zone].totalCount += 1;
        zoneData[zone].totalLength += parseFloat(row.TotalLength || 0);
        zoneData[zone].totalStops += parseInt(row.NumberofStops || 0);
        zoneData[zone].totalConstructionCost += parseFloat(
          row.ConstructionCost || 0
        );
        zoneData[zone].totalServiceCost += parseFloat(row.ServiceCost || 0);
      }
    });

    // Calculate averages for each zone
    let averages = {};
    for (let zone in zoneData) {
      if (zoneData[zone].totalCount > 0) {
        averages[zone] = {
          averageLength: parseFloat(
            (zoneData[zone].totalLength / zoneData[zone].totalCount).toFixed(2)
          ),
          averageStops: parseFloat(
            (zoneData[zone].totalStops / zoneData[zone].totalCount).toFixed(2)
          ),
          averageConstructionCost: parseFloat(
            (
              zoneData[zone].totalConstructionCost / zoneData[zone].totalCount
            ).toFixed(2)
          ),
          averageServiceCost: parseFloat(
            (
              zoneData[zone].totalServiceCost / zoneData[zone].totalCount
            ).toFixed(2)
          ),
        };
      }
    }

    res.status(200).json({
      message: "Successfully retrieved bus routes data",
      //data: busRoutes
      data: averages,
    });
  } catch (error) {
    console.error("Error fetching bus routes data:", error);
    res.status(500).json({
      message: "Failed to retrieve data",
      error: error.message,
    });
  }
}

const getAllRoutesByZone = async (req, res) => {
  try {
    // Aggregate the data to group routes by zone
    const routesByZone = await BusRoutes.aggregate([
      {
        $group: {
          _id: "$Zone", // Group by zone field
          routes: {
            $push: {
              RouteAccess: "$RouteAccess",
              BusStops: "$BusStops",
              Source: "$Source",
              Destination: "$Destination",
              NumberofStops: "$NumberofStops",
              StopCoordinateMap: "$StopCoordinateMap",
            },
          }, // Push each document to the routes array
        },
      },
    ]);

    // Transform the result to match the desired format
    const formattedRoutesByZone = routesByZone.map(({ _id: zone, routes }) => ({
      zone,
      routes,
    }));

    // Return the routes data grouped by zone
    res.json(formattedRoutesByZone);
  } catch (error) {
    // Handle errors
    console.error("Error fetching routes by zone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
async function getPieChartDataController(req, res) {

  try {

      const { Source, Destination } = req.query; //.query;

      console.log("Source:", Source);
      console.log("Destination:", Destination);

      const sourceStops = await BusStops.find({ StopName: Source });
      const destinationStops = await BusStops.find({ StopName: Destination });

      if (sourceStops.length === 0) {
          return res.status(404).json({
              message: "Source Stops not found in the database"
          });
      }
      if (destinationStops.length === 0) {
          return res.status(404).json({
              message: "Destination Stops not found in the database"
          });
      }

      let SourceStopNames = sourceStops.map(stop => stop.StopName);
      let DestinationStopNames = destinationStops.map(stop => stop.StopName);
      let Source_Stop_Ids = sourceStops.map(stop => stop.StopCode);
      let Destination_Stop_Ids = destinationStops.map(stop => stop.StopCode);
      let Source_Stop_Routes = sourceStops.flatMap(stop => stop.Routes);
      let Destination_Stop_Routes = destinationStops.flatMap(stop => stop.Routes);
      let uniqueSourceStopRoutes = new Set(Source_Stop_Routes);
      let uniqueDestinationStopRoutes = new Set(Destination_Stop_Routes);
      let intersectionRoutes = new Set([...uniqueSourceStopRoutes].filter(x => uniqueDestinationStopRoutes.has(x)));
      let SourceLatitudes = sourceStops.map(stop => stop.Latitude); 
      let DestinationLatitudes = destinationStops.map(stop => stop.Latitude);
      let directionIndicator = DestinationLatitudes[0] > SourceLatitudes[0] ? "U" : "D";
      let direction = directionIndicator === "U" ? "UP" : "Down";


      if (direction === "UP") 
      {
          intersectionRoutes = new Set([...intersectionRoutes].filter(route => route.includes('U')));
      }
      else
      {
          intersectionRoutes = new Set([...intersectionRoutes].filter(route => route.includes('D')));

      }

      // console.log("=============================================================");
      // console.log("Source Stop Names:", SourceStopNames.join(", "));  
      // console.log("Destination Stop Names:", DestinationStopNames.join(", "));
      // console.log("Source Stop IDs:", Source_Stop_Ids.join(", "));
      // //console.log("Source Stop IDs:", Source_Stop_Ids);
      // console.log("Destination Stop IDs:", Destination_Stop_Ids.join(", "));
      // //console.log("Source Stop Routes (all):", Source_Stop_Routes.join(", "));
      // console.log("Unique Source Stop Routes:", Array.from(uniqueSourceStopRoutes).join(", "));
      // //console.log("Destination Stop Routes (all):", Destination_Stop_Routes.join(", "));
      // console.log("Unique Destination Stop Routes:", Array.from(uniqueDestinationStopRoutes).join(", "));
      // console.log("Direction from Source to Destination:", direction);
      // console.log("Intersection of Routes:", Array.from(intersectionRoutes).join(", "));
      // //console.log("Intersection of Routes:", intersectionRoutes);
      // console.log("=============================================================");
      // console.log("Routes from all Source Stops:", sourceStops.map(stop => stop.Routes));
      // console.log("Routes from all Destination Stops:", destinationStops.map(stop => stop.Routes));

      let filteredSourceStopIds = Source_Stop_Ids.filter(id => {
          let routePart = id.split('-').slice(0, 2).join('-');
          return intersectionRoutes.has(routePart);
      });
      
      let filteredDestinationStopIds = Destination_Stop_Ids.filter(id => {
          let routePart = id.split('-').slice(0, 2).join('-');
          return intersectionRoutes.has(routePart);
      });
      
      filteredSourceStopIds.sort();
      filteredDestinationStopIds.sort();
      // console.log("*******************");
      // console.log("Filtered Source Stop IDs:", filteredSourceStopIds.sort());
      // console.log("Filtered Destination Stop IDs:", filteredDestinationStopIds.sort());
      // console.log("*******************");

      let IntersectionRoutesArray=Array.from(intersectionRoutes).sort();
      routesWithStops = IntersectionRoutesArray.map((routeId, index) => ({
          RouteId: routeId,
          SourceStop: filteredSourceStopIds[index],
          DestinationStop: filteredDestinationStopIds[index]
      }));

      //console.log("Routes with Stops:", routesWithStops);
      
      const routeIds = routesWithStops.map(item => item.RouteId);
      const routeAccessConditions = routeIds;

      // Query the database for the specified fields and conditions
      const busRoutes = await BusRoutes.find({
          RouteAccess: { $in: routeAccessConditions }
      }, 'RouteAccess ConstructionCost ServiceCost TotalLength NumberofStops StopCoordinateMap');

      //console.log("Bus Routes:", busRoutes);  


      let mergedRoutes = routesWithStops.map(route => {
          // Find the matching route data from busRoutes
          let matchingRoute = busRoutes.find(busRoute => busRoute.RouteAccess === route.RouteId);
      
          // If a matching route is found, merge the data
          if (matchingRoute) {
              return {
                  RouteId: route.RouteId,
                  SourceStop: route.SourceStop,
                  DestinationStop: route.DestinationStop,
                  // ServiceCost: matchingRoute.ServiceCost,
                  // ConstructionCost: matchingRoute.ConstructionCost,
                  TotalLength: matchingRoute.TotalLength,
                  // NumberofStops: matchingRoute.NumberofStops,
                  StopCoordinateMap: matchingRoute.StopCoordinateMap
              };
          } else {
              // If no matching route is found, just return the initial data
              return route;
          }
      });


      function filterStopsBySourceAndDestination(mergedRoutes) {
          return mergedRoutes.map(route => {
              // Extract the numeric parts from the SourceStop and DestinationStop strings
              const sourceStopNumber = parseInt(route.SourceStop.split("-").pop(), 10);
              const destinationStopNumber = parseInt(route.DestinationStop.split("-").pop(), 10);
      
              // Determine the start and end for filtering based on the stop numbers
              const start = Math.min(sourceStopNumber, destinationStopNumber);
              const end = Math.max(sourceStopNumber, destinationStopNumber);
      
              // Filter the StopCoordinateMap array to include only the stops within the range
              const filteredStopCoordinateMap = route.StopCoordinateMap.filter(stop => {
                  const stopNumber = parseInt(stop.stop_id.split("-").pop(), 10);
                  return stopNumber >= start && stopNumber <= end;
              });
      
              // Return the route object with the filtered StopCoordinateMap
              return {
                  ...route,
                  StopCoordinateMap: filteredStopCoordinateMap
              };
          });
      }
      

      //console.log("Merged Routes:", mergedRoutes);
      const filteredMergedRoutes = filterStopsBySourceAndDestination(mergedRoutes);
      //console.log(filteredMergedRoutes);

      function calculateDistance(lat1, lon1, lat2, lon2) {
          const earthRadius = 6371; // Radius of the Earth in kilometers
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = earthRadius * c; // Distance in kilometers
          return distance;
      }
      
      function calculateTotalDistance(route) {
          let totalDistance = 0;
          const stops = route.StopCoordinateMap;
          for (let i = 0; i < stops.length - 1; i++) {
              const lat1 = stops[i].latitude;
              const lon1 = stops[i].longitude;
              const lat2 = stops[i+1].latitude;
              const lon2 = stops[i+1].longitude;
              totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
          }
          return totalDistance;
      }
      
      function calculateTotalDistances(filteredMergedRoutes) {
          const distances = {};
          filteredMergedRoutes.forEach(route => {
              const routeId = route.RouteId;
              const totalDistance = calculateTotalDistance(route);
              distances[routeId] = totalDistance;
          });
          return distances;
      }
      
      const totalDistances = calculateTotalDistances(filteredMergedRoutes);
      //console.log(totalDistances);

      function appendTotalDistanceToRoutes(filteredMergedRoutes) {
          filteredMergedRoutes.forEach(route => {
              route.totalDistance = calculateTotalDistance(route);
          });
      }

      appendTotalDistanceToRoutes(filteredMergedRoutes);
     
      //console.log(filteredMergedRoutes);
  
      res.status(200).json({
          message: "Source and Destination Routes retrieved successfully",
          // SourceStops: sourceStops.map(stop => ({
          //     StopName: stop.StopName,
          //     Routes: stop.Routes,
          //     Stop_ID: stop._id,
          //     StopCode: stop.StopCode
          // })),
          // DestinationStops: destinationStops.map(stop => ({
          //     StopName: stop.StopName,
          //     Routes: stop.Routes,
          //     Stop_ID: stop._id,
          //     StopCode: stop.StopCode
          // })),
          // IntersectionRoutes: Array.from(intersectionRoutes),
          // FilteredSourceStopIds: filteredSourceStopIds,
          // FilteredDestinationStopIds: filteredDestinationStopIds,
          //RouteDetails: routesWithStops
          data: filteredMergedRoutes
      });
  } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({
          message: "Failed to process request",
          error: error.message
      });
  }
}




const getAllRoutes = async (req, res) => {
  try {
    const routes = await BusRoutes.find(
      {},
      {
        _id: 1, // Exclude the _id field
        Source: 1, // Include the routeName field
        Destination: 1,
        RouteAccess: 1,
        StopCoordinateMap: 1, // Include the busNumber field
        // Add more fields as needed
      }
    );

    // Return the routes data grouped by zone
    res.status(200).json({
      message: "Succesfully retreived all Routes",
      data: routes,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching routes by zone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getAllPossibleRoutesDataController,
  getRadarDataController,
  getBusRoutesDataController,
  getBusRoutesHeatMapData,
  getAllRoutesByZone,
  getAllRoutes,
  getPieChartDataController
};
