import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import MapWithDirections from "../../components/MapWithDirections";
import MapWithOptimalRoute from "../../components/MapWithOptimalRoute";
import BarCharts from "../../components/BarCharts";
import ControlBar from "../../components/ControlBar";

const RoutesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalRoutes, setTotalRoutes] = useState(null);
  const [showMapWithOptimalRoute, setShowMapWithOptimalRoute] = useState(false);
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [initialRoutesData, setInitialRoutesData] = useState(null);
  const [optimalRouteData, setOptimalRouteData] = useState([]);
  const [showOptimalRoute, setShowOptimalRoute] = useState(false);
  const [durationsData, setDurationsData] = useState([]);
  const decodedParams = decodeURIComponent(location.pathname).split("/");
  const source = decodedParams[2];
  const destination = decodedParams[3];

  const transformRoutes = (data) => {
    setInitialRoutesData(data);
    console.log("Routes Data", data);
    const transformedRoutesArray = [];
    const origin = data[0]?.WayPointsCoordinateMap.reduce((acc, obj) => {
      if (obj.stop_id === data[0].SourceStop) {
        acc = {
          lat: obj.latitude,
          lng: obj.longitude,
        };
      }
      return acc;
    }, null);

    const destination = data[0]?.WayPointsCoordinateMap.reduce((acc, obj) => {
      if (obj.stop_id === data[0].DestinationStop) {
        acc = {
          lat: obj.latitude,
          lng: obj.longitude,
        };
      }
      return acc;
    }, null);
    data.forEach((route) => {
      const wayPointsCoordinateMap = route.WayPointsCoordinateMap.slice(
        1,
        route.WayPointsCoordinateMap.length - 1
      ).map((stop) => ({
        lat: stop.latitude,
        lng: stop.longitude,
      }));

      const restPointsCoordinateMapPostDestination = route.RestPointsCoordinateMapPostDestination.map(
        (stop) => ({
          lat: stop.latitude,
          lng: stop.longitude,
        })
      );

      transformedRoutesArray.push({
        origin,
        destination,
        wayPointsCoordinateMap,
        restPointsCoordinateMapPostDestination,
      });
    });

    return transformedRoutesArray;
  };

  const handleGetOptimalRoute = () => {
    setShowMapWithOptimalRoute(true);
    setShowOptimalRoute(true);
  };

  const findMatchingRoute = (routesData, otherObject) => {
    console.log("Initial Routes Data", routesData);
    console.log("Optimal Route Data", otherObject);
    return routesData.find((route) => {
      const routeWaypoints = route.WayPointsCoordinateMap.slice(1, -1).map(
        (point) => ({
          lat: point.latitude,
          lng: point.longitude,
        })
      );
      const otherWaypoints = otherObject.wayPointsCoordinateMap.map(
        (point) => ({
          lat: point.lat,
          lng: point.lng,
        })
      );
      return JSON.stringify(routeWaypoints) === JSON.stringify(otherWaypoints);
    });
  };

  const handleOptimalRouteComparisonAnalysis = () => {
    const result = initialRoutesData.map((route, index) => ({
      key: [route.RouteId][0],
      value: durationsData[index],
    }));
    navigate("/route-level-analysis", {
      state: { data: result },
    });
  };

  const handleOptimalRouteChange = (optimalRoute, minDuration, durations) => {
    console.log("Minimum Duration Data", minDuration);
    console.log("Durations Data", durations);
    console.log("Optimal Route", optimalRoute);
    console.log("Initial Routes Data for Enhancement", initialRoutesData);
    setOptimalRoute(optimalRoute);
    setDurationsData(durations);
    const matchedRoute = findMatchingRoute(initialRoutesData, optimalRoute);
    let matchedArray = [];
    console.log("Matched Route:", matchedRoute);
    matchedArray.push(matchedRoute);
    setOptimalRouteData(matchedArray);
  };

  const handleGenerateRouteAnalysis = () => {
    navigate(`/heatMap/${source}/${destination}`, {
      state: { source: source, destination: destination },
    });
  };

  useEffect(() => {
    setTotalRoutes(transformRoutes(location.state?.routesData?.data));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex justify-between mt-8 px-4">
        <div className="w-5/6 h-[600px]">
          {showMapWithOptimalRoute ? (
            <MapWithOptimalRoute optimalRoute={optimalRoute} />
          ) : (
            <>
              {totalRoutes && (
                <MapWithDirections
                  routesData={totalRoutes}
                  onOptimalChange={handleOptimalRouteChange}
                />
              )}
            </>
          )}
        </div>
        <ControlBar
          onClickHeatMapButton={handleGenerateRouteAnalysis}
          onClickEnhancementButton={handleOptimalRouteComparisonAnalysis}
          onClickOptimalRoute={handleGetOptimalRoute}
        />
      </div>
      <div className="mt-8">
        <BarCharts
          apiUrl="http://localhost:8000/routes/getBusRoutes"
          Source={source}
          Destination={destination}
          optimalRouteData={optimalRouteData}
          showOptimalRoute={showOptimalRoute}
        />
      </div>

    </div>
  );
};

export default RoutesPage;
