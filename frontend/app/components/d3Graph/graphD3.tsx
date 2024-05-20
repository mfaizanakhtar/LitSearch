import React, { useEffect, useRef, useState } from 'react';
import { D3LitGraph } from './d3helper';
import queriesState from '@/app/states/queriesState';
import * as d3 from 'd3';

const GraphD3 = ({width,height}:{width?:number,height?:number}) => {
  const d3Container = useRef(null);
  const tooltipDiv = useRef(null)
  const graphInstance = useRef<D3LitGraph | null>(null); // Corrected type
  const {nodesAndLinks,highlightPaper,revertHightLight,scrollToPaper} = queriesState()

  // const dynamicWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.65;
  // const dynamicHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)*0.95;

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
      graphInstance.current = new D3LitGraph(d3Container,nodesAndLinks.nodes || [],nodesAndLinks.links || [],
        "Year","Citation Count",
        tooltipDiv,
        highlightPaper,revertHightLight,scrollToPaper,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        width=width,height=height)
      
    }else{
      if(graphInstance.current) graphInstance.current.getGraphRef()?.remove()
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
        width={width}
        height={height}
      />
      <div ref={tooltipDiv}></div>
    </>
  );
};

export default GraphD3;
