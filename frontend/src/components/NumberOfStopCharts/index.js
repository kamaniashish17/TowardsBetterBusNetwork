import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const NumberOfStopsChart = ({ stops }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 200;
    const height = 20;

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    // Assuming a maximum of 100 stops for the scale domain
    const scale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    svg
      .append("rect")
      .attr("width", scale(stops))
      .attr("height", height)
      .attr("fill", "lightblue");

    svg
      .append("text")
      .attr("x", scale(stops) - 3) 
      .attr("y", height / 2) 
      .attr("dy", "0.35em") // Vertically center
      .attr("text-anchor", "end") // Align text at the end
      .text(stops)
      .attr("font-size", "10px")
      .attr("fill", "black");
  }, [stops]);

  return <svg ref={ref}></svg>;
};

export default NumberOfStopsChart;
