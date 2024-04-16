import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { D3LitGraph } from './d3helper';

const GraphD3 = () => {
  const d3Container = useRef(null);
  const tooltipDiv = useRef(null)

        const data = [
        {id: 'A', x: 10, y: 2015},
        {id: 'B', x: 20, y: 2016},
        {id: 'C', x: 50, y: 2017},
        {id: 'D', x: 75, y: 2018}
      ];

      const connections = [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'C' },
        { source: 'B', target: 'D' }
      ];

  useEffect(()=>{
    new D3LitGraph(d3Container,data,connections,tooltipDiv)

  },[])

  // useEffect(() => {
  //   if (d3Container.current) {
  //     const tooltip = d3.select(tooltipDiv.current)
  //     .attr('id',"tooltip")
  //     .attr("class", "tooltip z-50")
  //     .style("opacity", 0)
  //     .style("position", "absolute")
  //     .style("background-color", "white")
  //     .style("border", "solid")
  //     .style("border-width", "2px")
  //     .style("border-radius", "5px")
  //     .style("padding", "5px")
  //     // .style("z-index", "1000") // Ensure tooltip is layered above other content
  //     .style("pointer-events", "none"); // Ensure the tooltip doesn't interfere with mouse events


  //     const svg = d3.select(d3Container.current)
  //                   .attr("width", 900)
  //                   .attr("height", 800);

  //     const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  //           width = +svg.attr("width") - margin.left - margin.right,
  //           height = +svg.attr("height") - margin.top - margin.bottom;

  //     const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  //     const yScale = d3.scaleLinear().domain([2015, 2021]).range([height, 0]);

  //     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  //     g.append("g")
  //       .attr("transform", `translate(0,${height})`)
  //       .call(d3.axisBottom(xScale))
  //       .append("text")
  //       .attr("fill", "#000")
  //       .attr("y", -6)
  //       .attr("x", width)
  //       .attr("text-anchor", "end")
  //       .text("Citation Count");

  //     g.append("g")
  //       .call(d3.axisLeft(yScale).tickFormat(d3.format("d")))
  //       .append("text")
  //       .attr("fill", "#000")
  //       .attr("transform", "rotate(-90)")
  //       .attr("y", 6)
  //       .attr("dy", "0.71em")
  //       .attr("text-anchor", "end")
  //       .text("Year");

  //     const defineMarkers = (color:any, idSuffix:any) => {
  //       g.append('defs').append('marker')
  //         .attr('id', `arrowhead-${idSuffix}`)
  //         .attr('viewBox', '-0 -5 10 10')
  //         .attr('refX', 5)
  //         .attr('refY', 0)
  //         .attr('orient', 'auto')
  //         .attr('markerWidth', 6)
  //         .attr('markerHeight', 6)
  //         .append('svg:path')
  //         .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  //         .attr('fill', color);
  //     };

  //     defineMarkers(pathColourInitial, 'normal');
  //     defineMarkers(pathColourHover, 'hover'); // Red or any color for hover state

  //     const nodeRadius = 5;
  //     const data = [
  //       {id: 'A', x: 10, y: 2015},
  //       {id: 'B', x: 20, y: 2016},
  //       {id: 'C', x: 50, y: 2017},
  //       {id: 'D', x: 75, y: 2018}
  //     ];

  //     const connections = [
  //       { source: 'A', target: 'B' },
  //       { source: 'A', target: 'C' },
  //       { source: 'B', target: 'C' },
  //       { source: 'B', target: 'D' }
  //     ];

  //     // Draw curved paths
  //     const pathSelection = g.selectAll('.link')
  //       .data(connections.map(connection => ({
  //         source: data.find(node => node.id === connection.source),
  //         target: data.find(node => node.id === connection.target),
  //         id: connection.source + "-" + connection.target // Unique ID for the path
  //       })))
  //       .enter().append('path')
  //       .attr('class', 'link')
  //       .attr('id', d => `path-${d.id}`) // Assign ID based on unique connection ID
  //       .attr('d', (d:any) => {
  //           const startX = xScale(d.source.x),
  //                 startY = yScale(d.source.y),
  //                 endX = xScale(d.target.x),
  //                 endY = yScale(d.target.y);
  //           const dx = endX - startX,
  //                 dy = endY - startY,
  //                 dr = Math.sqrt(dx * dx + dy * dy),
  //                 // Adjustments to shorten the line so arrow doesn't overlap the circle
  //                 offsetX = (dx * nodeRadius * 2) / dr,
  //                 offsetY = (dy * nodeRadius * 1.3) / dr,
  //                 endXAdjusted = endX - offsetX,
  //                 endYAdjusted = endY - offsetY;
  //           // Generate a quadratic curve for a more natural connection path
  //           // const randomizer =  [true, false][Math.floor(Math.random() * 2)]
  //           const controlX = (startX + endX) / 2 // This remains the same
  //           const controlY = (startY + endY) / 2 - Math.abs(dy) / 3
  //           // const controlY = (startY + endY) / 2 + ( ? - (Math.abs(dy) / 3) : + (Math.abs(dy) / 3)); // Subtract instead of add to flip the curve
  //         return `M${startX},${startY}Q${controlX},${controlY} ${endXAdjusted},${endYAdjusted}`;
  
  //           // return `M${startX},${startY}Q${(startX + endX) / 2},${startY} ${endXAdjusted},${endYAdjusted}`;
  //       })
  //       .attr('stroke', pathColourInitial)
  //       .attr('stroke-width', 2)
  //       .attr('fill', 'none')
  //       .attr('marker-end', 'url(#arrowhead-normal)'); // Use normal marker initially
      
  //       // Draw circles for the nodes
  //       const nodeSelection = g.selectAll(".node")
  //         .data(data)
  //         .enter().append("circle")
  //         .attr("class", "node")
  //         .attr("r", 5)
  //         .attr("cx", d => xScale(d.x))
  //         .attr("cy", d => yScale(d.y))
  //         .style("fill", nodeInitialColour)
  //         .style("stroke", "gray")
  //         .style("stroke-width", 1)
  //         .style("cursor", "pointer")
  //         .on("mouseover", function(event,d) {
  //           console.log(tooltip)
  //           tooltip.transition()
  //           .duration(200)
  //           .style("opacity", 0.9)
  //           tooltip.html("Citations: " + d.x + "<br/>Year: " + d.y)
  //           .style("left", (event.pageX - 450) + "px")
  //           .style("top", (event.pageY - 100) + "px");

            
  //           d3.select(this)
  //             .style("fill",nodeHoverColour)
  //             .style("stroke-width", 3)
  //             .style("stroke", nodeHoverBorder); // Change node border color on hover
            
  //           // Highlight connected paths
  //           pathSelection.each(function(p) {
  //             if (p?.source?.id === d.id || p?.target?.id === d.id) {
  //               d3.select(this)
  //                 .attr('stroke', pathColourHover)
  //                 .attr('marker-end', 'url(#arrowhead-hover)');
  //             }
  //           });
  //         })
  //         .on("mouseout", function(event,d) {
  //           tooltip.style("opacity", 0); // Hide tooltip

  //           d3.select(this)
  //             .style("stroke-width", 1)
  //             .style("stroke", "gray"); // Revert node border color
            
  //           // Revert connected paths
  //           pathSelection.each(function(p) {
  //             if (p?.source?.id === d.id || p?.target?.id === d.id) {
  //               d3.select(this)
  //                 .attr('stroke', '#d3d3d3')
  //                 .attr('marker-end', 'url(#arrowhead-normal)');
  //             }
  //           });
  //         });

  //         g.selectAll(".node-text")
  //         .data(data) // Assuming 'data' is your dataset
  //         .enter().append("text")
  //         .attr("class", "node-text")
  //         .attr("x", (d:any) => xScale(d.x) - nodeRadius + 15) // Adjust according to your scale
  //         .attr("y", (d:any) => yScale(d.y) - nodeRadius + 17) // Adjust according to your scale
  //         .attr("dy", ".35em") // Vertically center text
  //         .style("tex-color","gray")
  //         .attr("text-anchor", "middle") // Center text horizontally on its coordinate
  //         .text(d => d.id); // Assuming each node has an 'id' you want to display
    
  //       }
  // }, []); // The empty dependency array ensures this effect runs only once

  return (
    <>
      <svg
        ref={d3Container}
        className="d3-component"
        width={900}
        height={800}
      />
      <div ref={tooltipDiv}></div>
    </>
  );
};

export default GraphD3;
