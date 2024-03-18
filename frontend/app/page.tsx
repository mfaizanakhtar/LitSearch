'use client'
import Mock from "./components/mock";
import Card from "./components/utility/card";
import Search from "./components/search";
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Loader from "./components/utility/Loader";
import VegaGraph from "./components/Graph/VegaGraph";
import PaperDetails from "./components/PaperDetails";
import ScrollToTop from "./components/utility/ScrollToTop";
import axios from "axios";
import { sortByDate } from "./helper";
import { Paper } from "./interfaces";
import queriesState from "./states/state";
import projectState from "./states/projectsState";
import Header from "./components/utility/Header";

export default function Home() {
  const { data: session, status }:any = useSession({
    required:true
  });
  const [userId, setUserId] = useState(null);
  const {queries} = queriesState()
  const {setQueries} = queriesState()
  const {sortType} = queriesState()
  const [sortedPapers,setsortedPapers] = useState<Paper[]>([])
  const {getAllProjects} = projectState()

  useEffect(() => {
    const sessionUserId = session?.user?.id;
    if (sessionUserId) {
      setUserId(sessionUserId);
    }
  }, [session]);

  useEffect(()=>{
    if(queries && queries.length > 0){
      let rawPapers = queries[0].papers.map((item,index)=>({...item,arrayIndex:index})) //to preserve original index for events
      let sortedPapers:Paper[] = []
      if(sortType.sortOrder=='relevance') sortedPapers = rawPapers // keep as is
      else sortedPapers = sortByDate(rawPapers,sortType.sortOrder) //sort here
      setsortedPapers(sortedPapers)
    }
  },[JSON.stringify(queries),sortType])

  useEffect(()=>{
    if(userId && queries.length==0){
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/userQueryHistory?userId=${session?.user?.id}`)
        .then(({data})=>{
            console.log(data)
            setQueries(data); // Update your state with the response data
          setIsLoading(false)
        })
        .catch(error=>{
    
        })
    }
},[userId])

  useEffect(()=>{
    if(userId){
      getAllProjects(userId)
    }
  },[userId])
  
  const {detailView} = queriesState()
  const [isLoading, setIsLoading] = useState(false)

  return (
   <>
   <div className="fixed z-50 w-full"><Header/></div>
    <main className="w-1/3 h-full flex flex-col">
    <div className="fixed w-1/3 z-20 bg-white pb-5 rounded-lg mt-20"><Search setIsLoading={setIsLoading}/></div>
    <div className="mt-24">
      {isLoading ? <div className="mt-28"><Loader/></div> : <></>}
      <ul role="list" className="mt-28 space-y-3 px-4 sm:px-6 lg:px-8">
        {queries.length > 0 ? 
        sortedPapers.map((paper,index) => (
          <Card key={paper.paperId} arrayIndex={paper.arrayIndex}  {...paper}  />
        )) 
        : <></>}
      </ul>
      </div>
      <Mock />
    </main>

    <aside className="fixed inset-y-0 right-0 w-2/3 flex flex-col mt-20">
      {/* <Mock /> */}
      {detailView ? <PaperDetails /> : <div className="absolute z-0 fade-in"><VegaGraph /></div>}
    </aside>
    <ScrollToTop></ScrollToTop>
    </>
  )
}
