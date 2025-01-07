import React from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker
} from '@vis.gl/react-google-maps';
// import RadarChart from "./RadarChart";
import Directions from "../Directions"
import RadarChart from '../RadarGroup';

const MapWithZones = (routes) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;

    console.log("zones ", routes);

    const handleMapClick = (event) => {
        console.log('Map clicked:', event);
        console.log('Map clicked:', event.detail.latLng);
        const latLng = event.detail.latLng;
        console.log('Clicked latitude:', latLng.lat);
        console.log('Clicked longitude:', latLng.lng);
    };

    const handleGetDuration = (index, duration) => {
        console.log('Duration received:', duration);
    };


    return (
        <APIProvider apiKey={API_KEY}>
            <div style={{ height: "1200px", width: "100%" }}>
                <Map
                    center={{ lat: 18.5250397, lng: 73.8452698 }}
                    zoom={13}
                    // gestureHandling={'greedy'}
                    // fullscreenControl={false}
                    mapId={MAP_ID}
                    onClick={handleMapClick}
                    disableDefaultUI={true}
                >

                {routes.routes.map((route, index) => {
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
                                caseNum={1}
                            />

                        </React.Fragment>
                    )
                })}

                {/* First vertical dividing line */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: 'black',
                    }}
                ></div>
                {/* Second horizontal dividing line */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: 'black',
                }}
                ></div>
                <RadarChart apiUrl={"http://localhost:8000/routes/getRadarData"}/>
                </Map>
            </div>
        </APIProvider>
);
};

export default MapWithZones;