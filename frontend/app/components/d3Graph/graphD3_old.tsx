import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphD3 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current)
                    .attr("width", 900)
                    .attr("height", 800);

      const margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

      const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
      const yScale = d3.scaleLinear().domain([2015, 2021]).range([height, 0]);

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("fill", "#000")
        .attr("y", -6)
        .attr("x", width)
        .attr("text-anchor", "end")
        .text("Citation Count");

      g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format("d")))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Year");

      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#d3d3d3');

      const nodeRadius = 5;
      const data = [
        {id: 'A', citations: 10, year: 2015},
        {id: 'B', citations: 20, year: 2016},
        {id: 'C', citations: 50, year: 2017},
        {id: 'D', citations: 75, year: 2018}
      ];

      const connections = [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'C' },
        { source: 'B', target: 'D' }
      ];

      // Draw curved paths
      g.selectAll('.link')
        .data(connections.map(connection => ({
          source: data.find(node => node.id === connection.source),
          target: data.find(node => node.id === connection.target)
        })))
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', (d:any) => {
            const startX = xScale(d.source.citations),
                  startY = yScale(d.source.year),
                  endX = xScale(d.target.citations),
                  endY = yScale(d.target.year);
            const dx = endX - startX,
                  dy = endY - startY,
                  dr = Math.sqrt(dx * dx + dy * dy),
                  // Adjustments to shorten the line so arrow doesn't overlap the circle
                  offsetX = (dx * nodeRadius * 1.3) / dr,
                  offsetY = (dy * nodeRadius * 2.5) / dr,
                  endXAdjusted = endX - offsetX,
                  endYAdjusted = endY - offsetY;
            // Generate a quadratic curve for a more natural connection path
            return `M${startX},${startY}Q${(startX + endX) / 2},${startY} ${endXAdjusted},${endYAdjusted}`;
        })
        .attr('stroke', '#d3d3d3')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');

      // Draw circles for the nodes
      g.selectAll(".node")
        .data(data)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", nodeRadius)
        .attr("cx", d => xScale(d.citations))
        .attr("cy", d => yScale(d.year))
        .style("fill", "#4f46e5");
    }
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <svg
      ref={d3Container}
      className="d3-component"
      width={900}
      height={800}
    />
  );
};

export default GraphD3;
