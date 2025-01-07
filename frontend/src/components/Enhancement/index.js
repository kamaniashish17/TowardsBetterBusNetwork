import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const ref = useRef();
  const svgId = "bar-chart-svg";
  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const width = 660 - margin.left - margin.right;
  const height = 650 - margin.top - margin.bottom;

  useEffect(() => {
    d3.select(`#${svgId}`).remove();
    d3.select(".tooltip").remove();
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("id", svgId)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.key))
      .padding(0.4);

    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    xAxisGroup
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "16px")
      .text("Route ID");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);
    const yAxisGroup = svg.append("g").call(d3.axisLeft(y));

    yAxisGroup
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "16px")
      .text("Time in Seconds");

    const minValue = d3.min(data, (d) => d.value);

    svg
      .selectAll("Bars")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.key))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => (d.value === minValue ? "#69b3a2" : "#F4B678"))
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .attr("height", (d) => height - y(0))
      .attr("y", (d) => y(0))
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(`<strong>${d.key}</strong>: ${d.value.toFixed(2)}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
        d3.select(this)
          .style("opacity", 1)
          .attr("stroke", "black")
          .attr("fill", "#C46100")
          .attr("stroke-width", "4px");
      })
      .on("mouseout", function (event, d) {
        tooltip.transition().duration(500).style("opacity", 0);

        d3.select(this)
          .style("opacity", 1)
          .attr("stroke", "black")
          .attr("fill", (d) => (d.value === minValue ? "#69b3a2" : "#F4B678"))
          .attr("stroke-width", "2px");
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .delay((d, i) => i * 100);
  }, [data]);

  return <div style={{ margin: "0 auto", textAlign: "center" }} ref={ref} />;
};

export default BarChart;
