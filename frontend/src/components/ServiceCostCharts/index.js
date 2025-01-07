// ServiceCostChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ServiceCostChart = ({ cost }) => {
  const ref = useRef();

  useEffect(() => {
    if (cost == null) return; // Exit if cost is null or undefined

    const width = 200; // Width of the chart
    const height = 20; // Height of the chart

    // Clear previous SVG content
    const svg = d3.select(ref.current)
                  .attr('width', width)
                  .attr('height', height);
    svg.selectAll("*").remove();

    // Assuming 10000 is the max value for the service cost for scale domain
    const maxCost = 10000;
    const scale = d3.scaleLinear()
      .domain([0, maxCost])
      .range([0, width]);

    // Draw the rectangle for the bar
    svg.append('rect')
       .attr('width', scale(cost))
       .attr('height', height)
       .attr('fill', 'lightblue'); // Choose a color that fits your chart's theme

    // Draw the text for the cost
    svg.append('text')
       .attr('x', scale(cost) - 3) // Position text at the end of the bar, -3 for padding
       .attr('y', height / 2) // Center text in the bar height
       .attr('dy', '0.35em') // Vertically center text
       .attr('text-anchor', 'end') // Align text to the end
       .text(cost.toFixed(2)) // Format the cost value to 2 decimal places
       .attr('fill', 'black') // Set the text color for visibility
       .attr('font-size', '10px');

    
    if (scale(cost) < 20) { 
      svg.select('text')
         .attr('x', scale(cost) + 3) 
         .attr('text-anchor', 'start') 
         .attr('fill', 'black'); 
    }

  }, [cost]); // Redraw chart if cost changes

  return <svg ref={ref}></svg>;
};

export default ServiceCostChart;