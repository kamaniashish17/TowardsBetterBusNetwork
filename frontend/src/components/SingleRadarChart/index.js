import React, {useEffect} from "react";
import * as d3 from "d3";

const SingleRadarChart = ({ data, name }) => {
    const ref = React.useRef();
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;


var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");




    useEffect(() => {
        if (data.length === 0) return;
        console.log("DATA DATA DATA",data);
        const svg = d3.select(ref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .style("background", "white")
            .append('g')
            .attr('transform', `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const angleSlice = Math.PI * 2 / data.length;
        const rScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, radius]);



        const zoneColors = 
        {
            "Zone 1": "red",
            "Zone 2": "blue",
            "Zone 3": "green",
            "Zone 4": "yellow",
        };

        const fillColor = zoneColors[name];


        const textColor = {
            "Zone 1": "white",
            "Zone 2": "white",
            "Zone 3": "white",
            "Zone 4": "black",
        }
        const textFillColor = textColor[name];

        


        // Draw the background circles
        svg.selectAll(".grid-circle")
            .data(d3.range(1, data.length+1).reverse())
            .enter()
            .append("circle")
            .attr("class", "grid-circle")
            .attr("r", d => radius / data.length * d)
            .style("fill", "white")
            .style("opacity", 0.3)
            .style("stroke", "black")
            .style("stroke-dasharray", "2,2")
            .style("stroke-width", "4px");

        // Draw the axes (lines)
        const axes = svg.selectAll(".axis")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "axis");

        axes.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("stroke", "grey")
            .style("stroke-width", "2px");

        // Add axis labels

        // axes.append("text")
        // .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
        // .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
        // .text(d => d.axis)
        // .style("text-anchor", "middle")
        // .attr("alignment-baseline", "middle")
        // .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
        // .style("font-size", "12px");


    

        
        axes.append("text")
            .attr("x", (d, i) => {
                return (radius + 20) * Math.cos(angleSlice * i - Math.PI/2);
            })
            .attr("y", (d, i) => {
                return (radius + 20) * Math.sin(angleSlice * i - Math.PI/2);
            })
            .text(d => d.axis)
            .style("font-size", "15px")
            .style("font-weight", "bold") // Makes text bold
            .style("fill", "red") // Change text color for emphasis
            .attr("text-anchor", (d, i) => {
                // Anchor text based on its quadrant to avoid overlap with the chart
                if (i === 0) return "middle";
                else if (i === 1) return "start";
                else if (i === 2) return "middle";
                else if (i === 3) return "end";
            })
            .attr("alignment-baseline", (d, i) => {
                // Baseline adjustment for vertical centering
                if (i === 0) return "ideographic";
                else if (i === 1) return "hanging";
                else if (i === 2) return "hanging"
                else if (i === 3) return "ideographic";
            });


            
        // Draw the radar area
        const radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        

        svg.append("path")
            .datum(data)
            .attr("class", "radarArea")
            .attr("d", radarLine)
            .style("stroke", "black") 
            .style("fill", fillColor)
            .style("fill-opacity", 0.4)
            .on('mousemove', function(event, d) {
                // console.log("MOUSEMOVE", event, d);
                tooltip.transition()
                    .duration(100)
                    .style('opacity', 1);
                let tooltipHtml = d.map(item => `<strong>${item.axis}</strong>: ${item.value.toFixed(2)}`).join('<br/>');
                tooltip.html(tooltipHtml)
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);
    
                d3.select(this)
                    .style('opacity', 0.7)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '3px');
            })
            .on('mouseout', function(event, d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
    
                d3.select(this)
                    .style('opacity', 1)
                    .attr('stroke', 'none');
            });
            

        // add background to title
        svg.append("rect")
        .attr("x", -radius / 2)
        .attr("y", -radius * 1.6)
        .attr("width", radius)
        .attr("height", 40)
        .style("fill", fillColor)
        .style("opacity", 0.1)
        .style("stroke", "black")
        .style("stroke-width", "2px")
        



        ////Add a title to each radar chart
        svg.append("text")
            .attr("class", "title")
            .attr("x", 0)
            .attr("y", -radius * 1.4)
            .attr("text-anchor", "middle")
            .style("font-size", "26px")
            .style("fill", textFillColor)
            .text(name);




        

    }, [data, name, width, height, margin, radius]);

    return (
        <svg ref={ref} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} />
    );
};

export default SingleRadarChart;