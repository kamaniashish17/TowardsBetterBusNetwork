// BarCharts.js

import React, { useState, useEffect } from 'react';
import './BarChart.css';

import sortIcon from "../../images/sorticon.png"
import ServiceCostChart from '../ServiceCostCharts'
import ConstructionCostChart from '../ConstructionCostCharts';
import TotalLengthChart from '../TotalLengthCharts';
import NumberOfStopsChart from '../NumberOfStopCharts';
import HeaderChart from '../HeaderCharts';

const BarCharts = ({ apiUrl, Source, Destination, optimalRouteData, showOptimalRoute }) => {
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: '',
    x: 0,
    y: 0,
  });

  console.log("Bar Chart", optimalRouteData)

  useEffect(() => {
    if (Source && Destination) {
      if(optimalRouteData.length <= 0){
      const url = `${apiUrl}?Source=${encodeURIComponent(Source)}&Destination=${encodeURIComponent(Destination)}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data && Array.isArray(data.data)) {
            setTableData(data.data);
          } else {
            throw new Error('Data received is not in expected format');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setTableData([]);
        });
    }
    else{
      setTableData(optimalRouteData)
    }
  }
  }, [apiUrl, Source, Destination, showOptimalRoute]);

  const sortTable = (column) => {
    const direction =
      sortConfig && sortConfig.key === column && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...tableData].sort((a, b) =>
      direction === "asc"
        ? a[column] - b[column]
        : b[column] - a[column]
    );
    setSortConfig({ key: column, direction });
    setTableData(sortedData);
  };

  const showTooltip = (e, routeId, columnName, value) => {
    setTooltip({
      show: true,
      content: `Route: ${routeId}, ${columnName}: ${value}`,
      x: e.pageX,
      y: e.pageY
    });
  };

  const moveTooltip = (e) => {
    setTooltip(prev => ({
      ...prev,
      x: e.pageX,
      y: e.pageY
    }));
  };

  const hideTooltip = () => {
    setTooltip(prev => ({
      ...prev,
      show: false
    }));
  };

  return (
    <div className="page-layout">
      <div className="upper-half"></div> {/* Upper half left intentionally empty */}
      <div className="lower-half">
        {tooltip.show && (
          <div className="tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', padding: '5px', pointerEvents: 'none', zIndex: 1000 }}>
            {tooltip.content}
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Route</th>
              <th>
                <div className="header-container">
                  <span className="header-title">Service Cost</span>
                  <button onClick={() => sortTable('ServiceCost')} className="sort-button">
                    <img src={sortIcon} alt="Sort" />
                  </button>
                  <HeaderChart data={tableData.map(item => item.ServiceCost)} />
                </div>
              </th>
              <th>
                <div className="header-container">
                  <span className="header-title">Construction Cost</span>
                  <button onClick={() => sortTable('ConstructionCost')} className="sort-button"><img src={sortIcon} alt="Sort" /></button>
                  <HeaderChart data={tableData.map(item => item.ConstructionCost)} />
                </div>
              </th>
              <th>
                <div className="header-container">
                  <span className="header-title">Total Length</span>
                  <button onClick={() => sortTable('TotalLength')} className="sort-button"><img src={sortIcon} alt="Sort" /></button>
                  <HeaderChart data={tableData.map(item => item.TotalLength)} />
                </div>
              </th>
              <th>
                <div className="header-container">
                  <span className="header-title">Number of Stops</span>
                  <button onClick={() => sortTable('NumberofStops')} className="sort-button"><img src={sortIcon} alt="Sort" /></button>
                  <HeaderChart data={tableData.map(item => item.NumberofStops)} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((route, index) => (
                <tr key={index}>
                  <td>{route.RouteId}</td>
                  <td
                    onMouseEnter={(e) => showTooltip(e, route.RouteId, 'Service Cost', route.ServiceCost.toFixed(2))}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    <ServiceCostChart cost={route.ServiceCost} />
                  </td>
                  <td
                    onMouseEnter={(e) => showTooltip(e, route.RouteId, 'Construction Cost', route.ConstructionCost.toFixed(2))}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    <ConstructionCostChart cost={route.ConstructionCost} />
                  </td>
                  <td
                    onMouseEnter={(e) => showTooltip(e, route.RouteId, 'Total Length', route.TotalLength.toString())}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    <TotalLengthChart length={route.TotalLength} />
                  </td>
                  <td>
                      <NumberOfStopsChart stops={route.NumberofStops} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarCharts;
