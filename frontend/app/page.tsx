'use client'
import Mock from "./components/utility/mock";
import Card from "./components/projects/card";
import Search from "./components/queries/search";
import { useState, useEffect } from 'react'
import Loader from "./components/utility/Loader";
import VegaGraph from "./components/Graph/VegaGraph";
import PaperDetails from "./components/queries/paperDetails";
import ScrollToTop from "./components/utility/ScrollToTop";
import axios from "axios";
import { sortByDate } from "./helper";
import { Paper } from "./interfaces";
import queriesState from "./states/queriesState";
import projectState from "./states/projectsState";
import genericState from "./states/genericState";
import TeamMembers from "./components/projects/teamMembers";
import UserSession from "./components/utility/UserSession";
import Graph from "./components/flowGraph/graph";
import GraphD3 from "./components/d3Graph/graphD3";
import SuccessAlert from "./components/utility/SuccessAlert";

export default function Home() {

  // const [sortedPapers,setsortedPapers] = useState<Paper[]>([])

  const {queries,setQueries,sortType,setSortedPapers,sortedPapers,detailView} = queriesState()
  const {getAllProjects,selectedProject} = projectState()
  const {userId,displayMode} = genericState()
  const [graphWidth,setGraphWidth] = useState(0)
  const [graphHeight,setGraphHeight] = useState(0)

  const [showTeam,toggleShowTeam] = useState(false)

  useEffect(()=>{
    setGraphWidth((window?.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.65)
    setGraphHeight((window?.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)*0.95)
  },[])

  useEffect(()=>{
      let rawPapers:any[]=[];
      
      if(displayMode=='query' && queries && queries.length > 0){
        rawPapers = queries[0]?.papers?.map((item,index)=>({...item,arrayIndex:index})) || []//to preserve original index for events
      }
      else if (displayMode=='project' && selectedProject?.papers){
        rawPapers = [...selectedProject?.papers]
      }

      let sortedPapers:Paper[] = []
      if(sortType.sortOrder=='relevance') sortedPapers = rawPapers // keep as is
      else sortedPapers = sortByDate(rawPapers,sortType.sortOrder) //sort here
      setSortedPapers(sortedPapers)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedProject?.papers?.length,JSON.stringify(queries),sortType,displayMode])

  useEffect(()=>{
    if(userId){
      if(queries.length==0){
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/userQueryHistory?userId=${userId}`)
          .then(({data})=>{
              setQueries(data); // Update your state with the response data
            setIsLoading(false)
          })
          .catch(error=>{
      
          })
      }
      getAllProjects(userId)
    }
        
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])
  
  const [isLoading, setIsLoading] = useState(false)

  return (
   <>
    <SuccessAlert />
    <main className="w-1/3 h-full flex flex-col">
    <UserSession></UserSession>
    <div className="fixed w-1/3 z-20 bg-white pb-5 rounded-lg"><Search setIsLoading={setIsLoading}/></div>
    <div className="mt-40">
      {isLoading ? <div className="mt-10"><Loader/></div> : <></>}
      <ul role="list" className="mt-5 space-y-3 px-4 sm:px-6 lg:px-8">
        {queries.length > 0 ? 
        sortedPapers.map((paper) => (
          <Card key={paper.paperId} {...paper}  />
        )) 
        : <></>}
      </ul>
      </div>
     {sortedPapers.length>0 ? <></> : <Mock />} 
    </main>

    <aside className="fixed inset-y-0 right-0 w-2/3 flex flex-col mt-6">
      {detailView ? 
        <PaperDetails /> 
      :
      <div className="absolute z-0 fade-in">
        {displayMode=='project' ? 
        <>
          <TeamMembers showTeam={showTeam} toggleShowTeam={toggleShowTeam}/>
          <span className={showTeam ? 'hidden' : ''}><GraphD3 width={graphWidth} height={graphHeight*0.92}/></span>
        </>
        :
          <GraphD3 width={graphWidth} height={graphHeight} />
      }
      </div>
      }
    </aside>
    <ScrollToTop></ScrollToTop>
    </>
  )
}
