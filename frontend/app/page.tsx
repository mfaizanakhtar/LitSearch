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

export default function Home() {
  const { data: session, status } = useSession({
    required:true
  });
  const loading = status === 'loading';

  const papers = useRef(getState().papers);
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => getState.subscribe(
    state => (papers.current = state.papers)
  ), [])
  
  const detailView = getState((state)=>state.detailView)
  const [isLoading, setIsLoading] = useState(false)

  return (
   <>
    <main className="w-1/3 h-full flex flex-col">
      <Search setIsLoading={setIsLoading}/>
      {isLoading ? <Loader/> : <></>}
      <ul role="list" className="mt-6 space-y-3 mt-6 px-4 sm:px-6 lg:px-8">
        {papers.current.map((paper,index) => (
          <Card key={paper.paperId} index={index}  {...paper}  />
        ))}
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
