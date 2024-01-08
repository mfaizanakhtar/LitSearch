'use client'
import React, { useEffect, useRef } from 'react';
import { View, parse } from 'vega';
import getState from '@/app/state';
import { createSpec } from './graphSpec'; // Adjust the import path as needed

const VegaGraph: React.FC = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const papers = getState((state) => state.papers);
  

  useEffect(() => {
    if (graphRef.current && papers && papers.length>0) {
        var vegaPapersData:{name:string,values:any[]} = {"name":"publications",values:[]}
        // console.log(papers)
        vegaPapersData.values = papers.filter(paper => paper.publicationDate!=undefined).map(paper=>{
            return {"title":paper?.title,"year":paper?.publicationDate?.substring(0,4),"citations":paper?.citationCount}
        })
      const vegaSpec = createSpec(vegaPapersData)
      const view = new View(parse(vegaSpec), {
        renderer: 'svg',  // Specify SVG rendering
        container: graphRef.current,
        hover: true
      }).run();
    }
  }, [papers]);

  return <div ref={graphRef} />;
};

export default VegaGraph;
