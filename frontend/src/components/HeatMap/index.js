import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import hourlySrc from '../../images/hourly.png';
import routesSrc from '../../images/routes.png';
import './HeatMap.css';

const HeatMap = ({ apiUrl, Source, Destination, decision, decisionStr, color, id, xString, yString, label }) => {
    const ref = useRef();

    const [routes, setRoutes] = useState([]);

    const margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        const url = `${apiUrl}?Source=${encodeURIComponent(Source)}&Destination=${encodeURIComponent(Destination)}`;
        fetch(url)
            .then(response => response.json())
            .then(result => {
                setRoutes(result.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [apiUrl, Source, Destination, decision, decisionStr, color, id, xString, yString, label]);

    return (
        <div id={id}>
            {routes && routes.length > 0 && (
                <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} id="heatmap" ref={ref}>
                    <Grid
                        margin={margin}
                        width={width}
                        height={height}
                        decision={decision}
                        data={routes}
                        current={ref.current}
                        decisionStr={decisionStr}
                        color={color}
                        xString={xString}
                        yString={yString}
                        label={label}
                    />
                </svg>
            )}
        </div>
    )
};

const Grid = ({margin, width, height, decision, data, current, decisionStr, color, xString, yString, label}) => {
    useEffect(() => {
        const svg = d3.select(current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // data to be used for plotting individual squares
        const parsedData = data.map(d => d[decisionStr]);

        let x, y, uniqueRouteIds;
        if (decision == 1 || decision == 2) {
            x = data.map(d => d[xString]);
            uniqueRouteIds = Array.from(new Set(x));

            y = ["06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", 
                    "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"];
        } else {
            x = ["06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", 
            "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"];

            y = data.map(d => d[yString]);
            uniqueRouteIds = Array.from(new Set(y));
        }

        const xAxis = d3.scaleBand()
                        .range([0, width])
                        .domain(x)
                        .padding(0.01);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .remove();

        const yAxis = d3.scaleBand()
                        .range([height, 0])
                        .domain(y)
                        .padding(0.01);
        svg.append("g")
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
            .remove();

            if (decision == 1) {
                svg.append("text")
                    .attr("transform", `translate(${width / 2}, ${height + 25}) rotate(180)`)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(label);
    
                svg.append("image")
                    .attr("xlink:href", routesSrc)
                    .attr("width", 18)
                    .attr("height", 18)
                    .attr("transform", `translate(${width / 2 + 45}, ${height + 25}) rotate(180)`);
    
            } else if (decision == 2) {
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left - 2)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(label);
    
                svg.append("image")
                    .attr("xlink:href", hourlySrc)
                    .attr("width", 16)
                    .attr("height", 16)
                    .attr("x", -(height / 2) - 43)
                    .attr("y", -margin.left)
                    .attr("transform", "rotate(-90)");
            }

            let extent;
            if (decisionStr == 'Average_Load') {
                extent = [1, 70];
            } else {
                extent = d3.extent(parsedData);
            }

            let colorScale = d3.scaleLinear()
                                .range(["white", color])
                                .domain(extent);

            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "8px")
                .style("background", "#ffffff")
                .style("border", "1px solid #ccc")
                .style("border-radius", "5px")
                .style("pointer-events", "none");
            
            for (let i = 0; i < data.length; i++) {
                data[i].Average_Load = Math.floor(Math.random() * (70)) + 1;
            }

            if (x.length > 0 && y.length > 0) {
                svg.selectAll()
                    .data(data, function (d) {
                        return d[xString] + ':' + d[yString]; })
                    .enter()
                    .append("rect")
                    .attr("x", function (d) { return xAxis(d[xString]); })
                    .attr("y", function (d) { return yAxis(d[yString]); })
                    .attr("value", function (d) { return d[decisionStr]; })
                    .attr("width", xAxis.bandwidth())
                    .attr("height", yAxis.bandwidth())
                    .style("fill", "white") // initial color for transition effect
                    .transition() // add transition
                    .duration(1000) // set duration
                    .style("fill", function (d) { return colorScale(d[decisionStr]); }) // transition to final color
                    .delay(function (d, i) { return i * 10; }); // add delay for staggered effect
            }

            svg.selectAll("rect")
                .on("mousemove", function(e, d) {
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 2);

                    tooltip.transition()
                        .duration(100)
                        .style("opacity", .9);
                    tooltip.html(`<strong>Route ${d.Route_Id}</strong> has <strong>${d[decisionStr]}</strong> people at <strong>${d.TimeStamp}</strong>`)
                        .style("left", (e.pageX) + "px")
                        .style("top", (e.pageY - 28) + "px");
                })
                .on("mouseout", function(e, d) {
                    d3.select(this)
                        .style("stroke", "none");
                    
                    tooltip.transition()
                        .duration(100)
                        .style("opacity", 0);
                });

    });
    return null;
}

export default HeatMap;
