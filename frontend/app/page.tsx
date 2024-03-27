'use client'
import Mock from "./components/utility/mock";
import Card from "./components/projects/card";
import Search from "./components/queries/search";
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Loader from "./components/utility/Loader";
import VegaGraph from "./components/Graph/VegaGraph";
import PaperDetails from "./components/queries/PaperDetails";
import ScrollToTop from "./components/utility/ScrollToTop";
import axios from "axios";
import { sortByDate } from "./helper";
import { Paper } from "./interfaces";
import queriesState from "./states/queriesState";
import projectState from "./states/projectsState";
import genericState from "./states/genericState";
import TeamMembers from "./components/projects/teamMembers";

export default function Home() {
  const { data: session, status }:any = useSession({
    required:true
  });
  const [sortedPapers,setsortedPapers] = useState<Paper[]>([])

  const {queries,setQueries,sortType} = queriesState()
  const {getAllProjects,selectedProject} = projectState()
  const {userId,setUserId,userObj,setUserObj,displayMode} = genericState()

  useEffect(() => {
    if(!userObj?.userId){
        const sessionUserId = session?.user?.id;
        const sessionUserImage = session?.user?.image
        const sessionUserName = session?.user?.name
        if (sessionUserId) {
          setUserId(sessionUserId);
          setUserObj({userId:sessionUserId,userName:sessionUserName,userImage:sessionUserImage})
        }
    }
  }, [session]);

  useEffect(()=>{
      let rawPapers:any[]=[];
      
      if(displayMode=='query' && queries && queries.length > 0){
        rawPapers = queries[0].papers.map((item,index)=>({...item,arrayIndex:index})) //to preserve original index for events
      }
      else if (displayMode=='project' && selectedProject?.papers){
        rawPapers = [...selectedProject?.papers]
      }

      let sortedPapers:Paper[] = []
      if(sortType.sortOrder=='relevance') sortedPapers = rawPapers // keep as is
      else sortedPapers = sortByDate(rawPapers,sortType.sortOrder) //sort here
      setsortedPapers(sortedPapers)
  },[selectedProject.papers?.length,JSON.stringify(queries),sortType,displayMode])

  useEffect(()=>{
    if(userId){
      if(queries.length==0){
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/userQueryHistory?userId=${session?.user?.id}`)
          .then(({data})=>{
              console.log(data)
              setQueries(data); // Update your state with the response data
            setIsLoading(false)
          })
          .catch(error=>{
      
          })
      }
      getAllProjects(userId)
    }
        
  },[userId])
  
  const {detailView} = queriesState()
  const [isLoading, setIsLoading] = useState(false)

  return (
   <>
    <main className="w-1/3 h-full flex flex-col">
    <div className="fixed w-1/3 z-20 bg-white pb-5 rounded-lg"><Search setIsLoading={setIsLoading}/></div>
    <div className="mt-24">
      {isLoading ? <div className="mt-10"><Loader/></div> : <></>}
      <ul role="list" className="mt-5 space-y-3 px-4 sm:px-6 lg:px-8">
        {queries.length > 0 ? 
        sortedPapers.map((paper) => (
          <Card key={paper.paperId} arrayIndex={paper?.arrayIndex}  {...paper}  />
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
        displayMode=='project' ? <TeamMembers /> :  <div className="absolute z-0 fade-in"><VegaGraph /></div>}
    </aside>
    <ScrollToTop></ScrollToTop>
    </>
  )
}
