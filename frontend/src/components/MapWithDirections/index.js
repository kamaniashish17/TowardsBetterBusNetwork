import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import Directions from "../Directions";

const MapWithDirections = ({ routesData, onOptimalChange }) => {
  console.log("routesData", routesData);

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;
  console.log("API_K", API_KEY, MAP_ID)
  const color = [
    '#FF5733','#33FF57','#3357FF','#F1C40F','#9B59B6','#2ECC71','#E74C3C','#3498DB','#F39C12','#1ABC9C','#8E44AD','#2C3E50','#D35400','#16A085','#7F8C8D','#C0392B','#27AE60','#2980B9','#E67E22','#95A5A6'
  ];

  const origin = routesData[0].origin;
  const destination = routesData[0].destination;
  const [durations, setDurations] = useState(
    Array(routesData.length).fill(null)
  ); // Initialize with nulls
  const [allDurationsReceived, setAllDurationsReceived] = useState(false); // To check if all routes reported their durations

  console.log("Origin", origin);
  console.log("Destination", destination);

  // // Handle duration updates and track the minimum
  const handleGetDuration = (index, duration) => {
    console.log("Duration received:", duration);
    setDurations((prevDurations) => {
      const updatedDurations = [...prevDurations];
      updatedDurations[index] = duration;

      // If all durations are now available, set the flag
      if (updatedDurations.every((dur) => dur !== null)) {
        setAllDurationsReceived(true);
      }

      return updatedDurations;
    });
  };

  useEffect(() => {
    if (allDurationsReceived) {
      console.log("Durations", durations)
      const minDuration = Math.min(...durations);
      const optimalIndex = durations.findIndex((dur) => dur === minDuration);
      console.log("Optimal index:", optimalIndex);
      console.log("minDuration", minDuration);
      if (optimalIndex >= 0) {
        onOptimalChange(routesData[optimalIndex], minDuration, durations); // Pass the optimal route to the parent
      }
    }
  }, [allDurationsReceived, durations, routesData]);

  return (
      <APIProvider apiKey={API_KEY}>
        <div style={{ height: "600px", width: "100%" }}>
          <Map
            defaultCenter={{ lat: 18.5250397, lng: 73.8452698 }}
            // defaultZoom={9}
            gestureHandling={"greedy"}
            fullscreenControl={false}
            mapId={MAP_ID}
          >
            {routesData.map((route, index) => {
              console.log("Routes array mapping", route);
              console.log("WayPointsssss", route.wayPointsCoordinateMap)
              return (
                <React.Fragment key={index}>
                  <Directions
                    origin={route.origin}
                    destination={route.destination}
                    waypoints={route.wayPointsCoordinateMap}
                    index={index}
                    onDurationChange={handleGetDuration}
                    caseNum={2}
                  />
                  {route.wayPointsCoordinateMap?.map((waypoint, wpIndex) => {
                    console.log("wayPoint", waypoint)
                    return (
                      <AdvancedMarker
                        key={wpIndex}
                        position={waypoint}
                        title={`Waypoint ${wpIndex + 1}`}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            background: color[index % color.length],
                            border: "2px solid #0e6443",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                            opacity: 0.5,
                            class:"advanceMarker"
                          }}
                        ></div>
                      </AdvancedMarker>
                    );
                  })}
                </React.Fragment>
              );
            })}
            <AdvancedMarker position={origin} title={"Start"}>
              {/*<Pin scale={1.4}/>*/}
            </AdvancedMarker>

            <AdvancedMarker
              position={destination}
              title={"Destination"}
            ></AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
  );
};

export default MapWithDirections;
