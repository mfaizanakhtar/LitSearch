'use client'
import Mock from "./components/mock";
import Card from "./components/utility/card";
import Search from "./components/search";
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Loader from "./components/utility/Loader";
import VegaGraph from "./components/Graph/VegaGraph";
import getState from "./state";
import PaperDetails from "./components/PaperDetails";
import ScrollToTop from "./components/utility/ScrollToTop";
import axios from "axios";

export default function Home() {
  const { data: session, status }:any = useSession({
    required:true
  });
  const [userId, setUserId] = useState(null);
  const queries = getState((state) => state.queries);
  const setQueries = getState((state) => state.setQueries);

  

  // const queries = useRef(getState().queries);
  // // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  // useEffect(() => getState.subscribe(
  //   state => (queries.current = state.queries)
  // ), [])

  useEffect(() => {
    const sessionUserId = session?.user?.id;
    if (sessionUserId) {
      setUserId(sessionUserId);
    }
  }, [session]);

  useEffect(()=>{
    console.log(queries.length)
    if(userId && queries.length==0){
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/userQueryHistory?userId=${session?.user?.id}`)
        .then(({data})=>{
            console.log(data)
            setQueries(data); // Update your state with the response data
          setIsLoading(false)
        })
        .catch(error=>{
    
        })

    }
},[userId])
  
  const detailView = getState((state)=>state.detailView)
  const [isLoading, setIsLoading] = useState(false)

  return (
   <>
    <main className="w-1/3 h-full flex flex-col">
      <Search setIsLoading={setIsLoading}/>
      {isLoading ? <Loader/> : <></>}
      <ul role="list" className="mt-6 space-y-3 mt-6 px-4 sm:px-6 lg:px-8">
        {queries.length > 0 ? 
        queries[0].papers.map((paper,index) => (
          <Card key={paper.paperId} arrayIndex={index}  {...paper}  />
        )) 
        : <></>}
      </ul>
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
