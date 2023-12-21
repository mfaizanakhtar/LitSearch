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

export default function HomePage() {
  const papers = getState((state) => state.papers);
  const addPapers = getState((state) => state.add);
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
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/userPaperHistory?userId=${session?.user?.id}`)
    .then(({data})=>{
      addPapers(data.map((obj:any) => {
        return { pid: obj.paperId, title: obj.title, paperEvents:obj.paperEvents };
      })); // Update your state with the response data
      setIsLoading(false)
    })
    .catch(error=>{

    })
},[userId])
  
  
  return(
   <>
    <main className="w-1/3 h-full flex flex-col">
      {session?.user?.name}
      <Search setIsLoading={setIsLoading}/>
      {isLoading ? <Loader/> : <></>}
      <ul role="list" className="mt-6 space-y-3 mt-6 px-4 sm:px-6 lg:px-8">
        {papers.map((paper,index) => (
          <Card key={paper.pid} index={index} {... paper}  />
        ))}
      </ul>
      <Mock />
    </main>

    <aside className="fixed inset-y-0 right-0 w-2/3 flex flex-col">
      <Mock />
    </aside>
    </>
  )
}
