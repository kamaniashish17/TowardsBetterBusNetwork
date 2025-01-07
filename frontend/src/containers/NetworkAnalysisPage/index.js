import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import MapWithZones from "../../components/MapWithZones";

const NetworkAnalysisPage = () => {
  const [totalRoutes, setTotalRoutes] = useState(null);
  const location = useLocation();
  console.log("Data in Network Analysis Page", location.state?.routesData);

  const transformRoutes = (data) => {
    // const transformedData = [];
    const transformedRoutes = [];
    // Process each zone
    data.forEach((zone) => {
      const zoneName = zone.zone;
      const routes = zone.routes.slice(0, 20); // Limit to first 20 routes per zone

      routes.forEach((route) => {
        const stops = route.StopCoordinateMap;

        // Ensure origin and destination are unchanged
        const origin = {
          lat: stops[0].latitude,
          lng: stops[0].longitude,
        };

        const destination = {
          lat: stops[stops.length - 1].latitude,
          lng: stops[stops.length - 1].longitude,
        };

        // Limit the waypoints to a maximum of 25 stops between origin and destination
        const waypoints = stops
          .slice(1, Math.min(stops.length - 1, 26)) // Max 25 waypoints, excluding origin and destination
          .map((stop) => ({
            lat: stop.latitude,
            lng: stop.longitude,
          }));
        // if (zoneName === "Zone 4") {
        transformedRoutes.push({
          origin,
          destination,
          waypoints,
        });
        // }
      });

      // transformedData.push({
      //     zone: zoneName,
      //     routes: transformedRoutes,
      // });
    });

    console.log("transformed ", transformedRoutes);
    return transformedRoutes;
  };

  useEffect(() => {
    setTotalRoutes(transformRoutes(location.state?.routesData)); // Assuming the JSON has a 'routes' property
  }, []);

  console.log("total routes", totalRoutes);

  return (
    <div>
      <Header />

      <div>{totalRoutes && <MapWithZones routes={totalRoutes} />}</div>

      {/* <Footer /> */}
    </div>
  );
};

export default NetworkAnalysisPage;
