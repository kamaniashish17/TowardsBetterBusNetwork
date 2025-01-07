import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./PieChart.css";

const PieChart = ({ apiUrl, Source, Destination }) => {
  const [routes, setRoutes] = useState([]);
  const margin = { top: 20, right: 10, bottom: 20, left: 10 };
  const width = 60 - margin.left - margin.right;
  const height = 60 - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;

  useEffect(() => {
    const url = `${apiUrl}?Source=${encodeURIComponent(
      Source
    )}&Destination=${encodeURIComponent(Destination)}`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setRoutes(result.data);
        console.log("API Data:", result.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [apiUrl, Source, Destination]);

  return (
    <div id="pieChartGroup">
      {routes.map((route) => (
        <div
          key={route.RouteId}
          style={{ display: "flex", alignItems: "center" }}
        >
          {" "}
          {/* Inline styling for flex layout */}
          <svg
            id={`svg-${route.RouteId}`}
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          >
            <Pie
              route={route}
              width={width}
              height={height}
              radius={radius}
              margin={margin}
            />
          </svg>
          <div className="route-label">Route ID: {route.RouteId}</div>
        </div>
      ))}
    </div>
  );
};

const Pie = ({ route, width, height, radius, margin }) => {
  useEffect(() => {
    const svgId = `#svg-${route.RouteId}`;
    const svgElement = d3.select(svgId);
    svgElement.selectAll("*").remove();

    const svg = svgElement
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`
      );

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pieData = [
      {
        axis: "Source to Destination Length",
        value: parseFloat(route.totalDistance.toFixed(2)),
      },
      {
        axis: "Remaining Route Length",
        value: parseFloat((route.TotalLength - route.totalDistance).toFixed(2)),
      },
    ];
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = d3
      .scaleOrdinal()
      .domain(pieData)
      .range(["#FFB428", "#895900"]);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const arcs = svg
      .selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .on("mousemove", function (event, d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(`${d.data.axis}<br/>Value: ${d.data.value} kms`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");

        const currentSVG = d3.select(svgId);
        currentSVG.selectAll(".arc path").style("opacity", 0.2);

        d3.select(this)
          .style("opacity", 1)
          .attr("stroke", "black")
          .attr("stroke-width", "3px");
      })
      .on("mouseout", function (event, d) {
        tooltip.transition().duration(500).style("opacity", 0);

        const currentSVG = d3.select(svgId);
        currentSVG.selectAll(".arc path").style("opacity", 1);

        d3.select(this).attr("stroke", null).attr("stroke-width", null);
      });
  }, [route, width, height, radius, margin]);

  return null;
};

export default PieChart;
