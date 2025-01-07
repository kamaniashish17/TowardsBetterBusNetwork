import React, { useState, useEffect } from 'react';
import './RadarChart.css';
import SingleRadarChart from '../SingleRadarChart';


const RadarChart = ({ apiUrl }) => {
  const [zonesData, setZonesData] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        
        return response.json();
      })
      .then(result => {
        const zones = result.data;
        // console.log(zones);
        // console.log(result.data);
        const transformedData = Object.keys(zones).map(zoneKey => {
          const zoneData = zones[zoneKey];
          return {
            name: zoneKey,
            data: [

              { axis: 'Average Length', value: zoneData.averageLength*10 },
              { axis: 'Average Stops', value: zoneData.averageStops*4 },
              { axis: 'Average Construction Cost', value: zoneData.averageConstructionCost/75 },
              { axis: 'Average Service Cost', value: zoneData.averageServiceCost/75 }
            ]
          };
        });
        setZonesData(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [apiUrl]);

  const quadrantMap = {
    0: 'bottom-left', //zone 1 = bottom-left
    1: 'bottom-right', //zone 2 = bottom-right
    2: 'top-right', // zone 3 = top-right
    3: 'top-left' , //zone 4 = top-left
  };

  const getQuadrantPositionStyle = (quadrant) => {
    switch (quadrant) {
      case 'top-left':
        return { position: 'absolute', top: '5%', left: '0%' };
      case 'top-right':
        return { position: 'absolute', top: '5%', right: '0%' };
      case 'bottom-left':
        return { position: 'absolute', bottom: '5%', left: '0%' };
      case 'bottom-right':
        return { position: 'absolute', bottom: '5%', right: '0%' };
      default:
        return {};
    }
  };

  zonesData.forEach((zone, i) => {
    console.log("i =", i, "zone.name =", zone.name);
  });

  return (
      <div style={{ position: 'relative', height: '1200px', width: '100%' }}>
        {zonesData.map((zone, i) => (
            <div key={i} style={getQuadrantPositionStyle(quadrantMap[i])}>
              <SingleRadarChart data={zone.data} name={zone.name} />
            </div>
        ))}
      </div>
  );

};


  

export default RadarChart;