import React, { useEffect, useState } from 'react';
import Directions from '../src/Directions';

import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin
} from '@vis.gl/react-google-maps';
const MapWithDirections = ({routes, onOptimalChange} ) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;
    const color = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white', 'pink', 'brown']
    const origin = routes[0].origin;
    const destination = routes[0].destination;
    const [durations, setDurations] = useState(Array(routes.length).fill(null)); // Initialize with nulls
    const [allDurationsReceived, setAllDurationsReceived] = useState(false); // To check if all routes reported their durations
  
    // Handle duration updates and track the minimum
    const handleGetDuration = (index, duration) => {
        console.log('Duration received:', duration);
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
  
    // Once all durations are received, find the minimum and optimal route
    useEffect(() => {
      if (allDurationsReceived) {
        const minDuration = Math.min(...durations);
        const optimalIndex = durations.findIndex((dur) => dur === minDuration);
        console.log('Optimal index:', optimalIndex);
        console.log("minDuration",minDuration);
        if (optimalIndex >= 0) {
          onOptimalChange(routes[optimalIndex]); // Pass the optimal route to the parent
        }
      }
    }, [allDurationsReceived, durations, routes]);
  
    
    return (
        <APIProvider apiKey={API_KEY}>
            <div style={{height: '800px', width: '100%'}}>
                <Map
                    defaultCenter={{lat: 18.5250397, lng: 73.8452698}}
                    // defaultZoom={9}
                    gestureHandling={'greedy'}
                    fullscreenControl={false}
                    mapId={MAP_ID}>
                    
                    {routes.map((route, index) => {
                        console.log("Routes array mapping",route)
                        return ( 
                        <React.Fragment key={index}>
                            {/* Directions component */}
                            <Directions
                                origin={route.origin}
                                destination={route.destination}
                                waypoints={route.waypoints}
                                index={index}
                                onDurationChange={handleGetDuration}
                                caseNum={2}
                            />

                            {route.waypoints?.map((waypoint, wpIndex) => (
                                <AdvancedMarker
                                    key={wpIndex}
                                    position={waypoint}
                                    title={`Waypoint ${wpIndex + 1}`}
                                >
                                    {/*<Pin*/}
                                    {/*    background={color[index % color.length]} // Same color as route*/}
                                    {/*    // background={'#22ccff'}*/}
                                    {/*    borderColor={color[index % color.length]}*/}
                                    {/*    glyphColor={color[index % color.length]}*/}
                                    {/*/>*/}
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            background: color[index % color.length],
                                            border: '2px solid #0e6443',
                                            borderRadius: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            opacity: 0.5
                                        }}>
                                    </div>
                                </AdvancedMarker>
                            ))}
                        </React.Fragment>
                        )
                    })}
                    {/* Marker for origin */}
                    <AdvancedMarker position={origin} title={'Start'}>
                        {/*<Pin scale={1.4}/>*/}
                    </AdvancedMarker>

                    <AdvancedMarker position={destination} title={'Destination'}>
                    </AdvancedMarker>
                </Map>
            </div>
        </APIProvider>
);
};

export default MapWithDirections;