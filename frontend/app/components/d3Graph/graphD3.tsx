import React, { useEffect, useRef, useState } from 'react';
import { D3LitGraph } from './d3helper';
import queriesState from '@/app/states/queriesState';
import * as d3 from 'd3';

const GraphD3 = () => {
  const d3Container = useRef(null);
  const tooltipDiv = useRef(null)
  const graphInstance = useRef<D3LitGraph | null>(null); // Corrected type
  const {nodesAndLinks,highlightAndScrollToPaper,revertHightLight} = queriesState()

  // const data = [
  //   {id: 'A', x: 5000, y: 2000},
  //   {id: 'B', x: 12000, y: 2005},
  //   {id: 'C', x: 18000, y: 2010},
  //   {id: 'D', x: 22000, y: 2020}
  // ];

  // const connections = [
  //   { source: 'A', target: 'B' },
  //   { source: 'A', target: 'C' },
  //   { source: 'B', target: 'C' },
  //   { source: 'B', target: 'D' }
  // ];

  useEffect(()=>{
    if(nodesAndLinks.nodes?.length>0){
      console.log(nodesAndLinks)
      if(graphInstance.current) graphInstance.current.getGraphRef()?.remove()
      graphInstance.current = new D3LitGraph(d3Container,nodesAndLinks.nodes || [],nodesAndLinks.links || [],tooltipDiv,
        highlightAndScrollToPaper,revertHightLight)
      
    }
  },[nodesAndLinks])

  // useEffect(()=>{
  //   debugger
  //   if(nodesAndLinks.nodes?.length>0 && nodesAndLinks.links?.length>0){
  //     console.log(nodesAndLinks)
  //     new D3LitGraph(d3Container,data,connections,tooltipDiv)
  //   }
  // },[nodesAndLinks.nodes?.length])


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
