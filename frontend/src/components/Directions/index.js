import {useMap, useMapsLibrary} from "@vis.gl/react-google-maps";
import {useEffect, useState} from "react";

const Directions = ({origin, destination, waypoints, index, onDurationChange, caseNum}) => {
    const color = [
        '#FF5733','#33FF57','#3357FF','#F1C40F','#9B59B6','#2ECC71','#E74C3C','#3498DB','#F39C12','#1ABC9C','#8E44AD','#2C3E50','#D35400','#16A085','#7F8C8D','#C0392B','#27AE60','#2980B9','#E67E22','#95A5A6'
    ];
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [curRoute, setCurRoute] = useState(null);
    let highlightedPoly = null;

    // Initialize directions service and renderer
    useEffect(() => {
        if (!map || ! routesLibrary) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [map, routesLibrary]);
     
    // Use directions service
    useEffect(() => {

        if (!directionsRenderer || !directionsService || !origin || !destination || !waypoints) return;

        const waypts = waypoints.map(waypoint => ({location: {lat: waypoint.lat, lng: waypoint.lng}, stopover: true}));
        console.log("waypts", waypts)
        const request = {
            origin: origin,
            destination: destination,
            waypoints: waypts,
            travelMode: 'DRIVING',
            // provideRouteAlternatives: true
        };

        directionsService.route(request, (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                directionsRenderer.setOptions({
                    suppressMarkers: true,
                });
                setCurRoute(response.routes[0])
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        return () => {
            directionsRenderer.setMap(null);
        };

    }, [directionsRenderer, directionsService, origin, destination, waypoints]);

    useEffect(() => {
        if (!curRoute) return;
        directionsRenderer.setMap(null);
        console.log("cur route", curRoute);

        // console.log("index and color is ", index, color[Math.floor(index / 20) % 4]);
        const polylineOptions = {
            strokeColor: caseNum === 1 ? "#7469B6" : color[index % color.length],
            strokeOpacity: caseNum === 1 ? 0.8 : 0.5,
            strokeWeight: 6,
        };

        const routePath = [];

        let distance = 0;
        let duration = 0;

        curRoute.legs.forEach((leg) => {
            distance += leg.distance.value;
            duration += leg.duration.value;
            leg.steps.forEach((step) => {
                step.path.forEach((point) => routePath.push(point));
            });
        });

        onDurationChange(index, duration);

        console.log("distance", distance);
        console.log("duration", duration);
     

        const routePolyline = new window.google.maps.Polyline(polylineOptions);
        routePath.forEach((point) => routePolyline.getPath().push(point));
        routePolyline.setMap(map);

        // Highlight selected polyline and revert previous
        routePolyline.addListener('click', () => {
            if (highlightedPoly) {
                highlightedPoly.setOptions({ strokeOpacity: 0.5 }); // Revert color
            }

            routePolyline.setOptions({ strokeOpacity: 0.8 }); // Highlight
            highlightedPoly = routePolyline; // Store current highlight
        });

        // Add map click listener to revert highlight
        window.google.maps.event.addListener(map, 'click', () => {
            console.log("click");
            if (highlightedPoly) {
                highlightedPoly.setOptions({ strokeOpacity: 0.5 }); // Revert to original
            }
        });

    }, [curRoute, map]);

    return null;
}

export default Directions;