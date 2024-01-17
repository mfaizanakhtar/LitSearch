'use client'
import React from "react";
import Mock from "./mock";
import Card from "./utility/card";
import Search from "./search";
import getState from "../state";
import { useSession } from "next-auth/react";
import { useEffect,useState } from 'react'
import axios from "axios";
import Loader from "./utility/Loader";
import VegaGraph from "./Graph/VegaGraph";
import PaperDetails from "./PaperDetails";
import ScrollToTop from "./utility/ScrollToTop";

export default function HomePage() {
  const papers = getState((state) => state.papers);
  const paperQueries = getState((state) => state.paperQueries);
  const setPapersQueries = getState((state) => state.setPaperQueries);
  const setSearchQueriesHistory = getState((state)=>state.setSearchQueriesHistory);
  const detailView = getState((state)=>state.detailView)
  const [isLoading,setIsLoading]=useState(true)
  const [userId, setUserId] = useState(null);
  const {data : session}:any = useSession({
    required:true
  })
  
  useEffect(() => {
    const sessionUserId = session?.user?.id;
    if (sessionUserId) {
      setUserId(sessionUserId);
    }
  }, [session]);

  useEffect(()=>{
    if(userId && papers.length==0){
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/userPaperHistory?userId=${session?.user?.id}`)
        .then(({data})=>{
            console.log(data)
            setPapersQueries(data); // Update your state with the response data
          setIsLoading(false)
        })
        .catch(error=>{
    
        })

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/getAllSearchQueriesForUser?userId=${session?.user?.id}`)
        .then(({data})=>{
          let searchQueryArray = data.map((sQueries:any)=>sQueries.searchQuery)
          setSearchQueriesHistory(searchQueryArray)
        })
    }
},[userId])
  
  
  return(
   <>
    <main className="w-1/3 h-full flex flex-col">
        <div className="fixed w-1/3 z-50 bg-white pb-5 rounded-lg"><Search setIsLoading={setIsLoading}/></div>
        <div className="mt-20">
            {/* {session?.user?.name} */}
            {isLoading ? <Loader/> : <></>}
            <ul role="list" className="mt-6 space-y-3 mt-6 px-4 sm:px-6 lg:px-8">
                {papers.map((paper,index) => (
                <Card key={paper.paperId} arrayIndex={index}  {...paper}  />
                ))}
            </ul>
        </div>
      <Mock />
    </main>

    <aside className="fixed inset-y-0 right-0 w-2/3 flex flex-col">
      {/* <Mock /> */}
      {detailView ? <PaperDetails /> : <div className="fade-in"><VegaGraph /></div>}
    </aside>
    <ScrollToTop></ScrollToTop>
    </>
  )
}
