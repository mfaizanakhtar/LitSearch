'use client'
import React, { useEffect, useRef } from 'react';
import { View, parse } from 'vega';
import { createSpec } from './graphSpec'; // Adjust the import path as needed
import queriesState from '@/app/states/queriesState';
import { createDirectedGraph } from './directedGraphSpec';

const VegaGraph: React.FC = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const {queries,nodesAndLinks} = queriesState()
  

  // useEffect(() => {
  //   if (graphRef.current && queries.length>0 && queries[0]?.papers.length > 0) {
  //       var vegaPapersData:{name:string,values:any[]} = {"name":"publications",values:[]}
  //       // console.log(papers)
  //       vegaPapersData.values = queries[0].papers.filter(paper => paper.publicationDate!=undefined).map(paper=>{
  //           return {"title":paper?.title,"year":paper?.publicationDate?.substring(0,4),"citations":paper?.citationCount}
  //       })
  //     const vegaSpec = createSpec(vegaPapersData)
  //     // @ts-ignore
  //     const view = new View(parse(vegaSpec), {
  //       renderer: 'svg',  // Specify SVG rendering
  //       container: graphRef.current,
  //       hover: true
  //     }).run();
  //   }
  // }, [queries]);
  // useEffect(() => {
  //   if (graphRef.current && nodesAndLinks.length>0 && nodesAndLinks[0]?.values.length > 0) {

  //     const vegaSpec = createDirectedGraph(nodesAndLinks)
  //     // @ts-ignore
  //     const view = new View(parse(vegaSpec), {
  //       renderer: 'svg',  // Specify SVG rendering
  //       container: graphRef.current,
  //       hover: true
  //     }).run();
  //   }
  // }, [nodesAndLinks]);

  return <div ref={graphRef} />;
};

export default VegaGraph;
