import React from "react";
import Directions from "../Directions";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin, // Add the missing import statement for the Pin component
} from "@vis.gl/react-google-maps";

const MapWithOptimalRoute = (optimalRoute) => {
  console.log("Optimal Route", optimalRoute);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;
  const origin = optimalRoute.optimalRoute.origin;
  const destination = optimalRoute.optimalRoute.destination;
  const waypoints = optimalRoute.optimalRoute.wayPointsCoordinateMap;
  const rests =
    optimalRoute.optimalRoute.restPointsCoordinateMapPostDestination;

  const handleGetDuration = (index, duration) => {
    console.log("Duration received:", duration);
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: "600px", width: "100%" }}>
        <Map
          defaultCenter={{ lat: 18.5250397, lng: 73.8452698 }}
          defaultZoom={9}
          gestureHandling={"greedy"}
          fullscreenControl={false}
          mapId={MAP_ID}
        >
          {console.log("Optimal Route", optimalRoute)}
          {console.log("Optimal Route origin", origin)}
          {/* Directions component */}
          <Directions
            origin={origin}
            destination={destination}
            waypoints={waypoints}
            index={0}
            onDurationChange={handleGetDuration}
            caseNum={3}
          />

          {waypoints?.map((waypoint, wpIndex) => (
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
                  background: "red",
                  border: "2px solid #0e6443",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0.5,
                }}
              ></div>
            </AdvancedMarker>
          ))}

          {rests?.map((point, pIndex) => (
            <AdvancedMarker
              key={pIndex}
              position={point}
              title={`point ${pIndex + 1}`}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  background: "red",
                  border: "2px solid #0e6443",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  opacity: 0.7,
                }}
              ></div>
            </AdvancedMarker>
          ))}

          {/* Marker for origin */}
          <AdvancedMarker position={origin} title={"Start"}>
            <Pin scale={1.4} /> {/* Add the Pin component */}
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

export default MapWithOptimalRoute;
