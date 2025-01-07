// TotalLengthChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TotalLengthChart = ({ length }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 200;
    const height = 20;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    // Assuming 50 km is the longest route for scale domain
    const scale = d3.scaleLinear()
      .domain([0, 50])
      .range([0, width]);

    svg.append('rect')
      .attr('width', scale(length))
      .attr('height', height)
      .attr('fill', 'lightblue');
    
   
    svg.append('text')
      .attr('x', scale(length) - 3) // Adjust as needed
      .attr('y', height / 2) // Adjust as needed
      .attr('dy', '0.35em') // Vertically center
      .attr('text-anchor', 'end') // Align text at the end
      .text(length)
      .attr('font-size', '10px')
      .attr('fill', 'black');
  }, [length]);

  return <svg ref={ref}></svg>;
};

export default TotalLengthChart;