// HeaderChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HeaderChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 120;
    const height = 30;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([height, 0]);

    const area = d3.area()
      .x((_, i) => xScale(i))
      .y0(height)
      .y1(yScale)
      .curve(d3.curveMonotoneX);

    svg.selectAll("*").remove();
    svg.append('path')
      .datum(data)
      .attr('fill', 'lightblue')
      .attr('opacity', 0.5)
      .attr('d', area);
  }, [data]);

  return <svg ref={ref} className="header-chart"></svg>;
};

export default HeaderChart;