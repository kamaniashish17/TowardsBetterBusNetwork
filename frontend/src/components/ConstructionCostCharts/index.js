import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ConstructionCostChart = ({ cost }) => {
  const ref = useRef();

  useEffect(() => {
    // Set up SVG and the scaling
    const width = 200; // Width of the chart
    const height = 20; // Height of the chart

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Clear the SVG in case there is existing content
    svg.selectAll("*").remove();

    // Assuming max construction cost is known, or you can use d3.max to find it
    const maxCost = 20000; // This should be dynamic based on your data

    const xScale = d3.scaleLinear()
      .domain([0, maxCost])
      .range([0, width]);

    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', xScale(cost))
      .attr('height', height)
      .attr('fill', 'lightblue');

    // If you want to add text on the bar for the cost
    svg.append('text')
      .attr('x', xScale(cost) - 3) // Adjust as needed
      .attr('y', height / 2) // Adjust as needed
      .attr('dy', '0.35em') // Vertically center
      .attr('text-anchor', 'end') // Align text at the end
      .text(cost)
      .attr('font-size', '10px')
      .attr('fill', 'black');
    
  }, [cost]);

  return <svg ref={ref}></svg>;
};

export default ConstructionCostChart;