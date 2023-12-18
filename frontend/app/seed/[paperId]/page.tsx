'use client'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import SidebarLayout from '../../components/Layouts/RootLayout'
import axios from 'axios'
import { useRouter,useParams } from 'next/navigation'
import CardLists from '../../components/utility/CardLists'

export default function page() {

    const {paperId} = useParams()

    const [references,setReferences]=useState([])
    const [citations,setCitations]=useState([])

    useEffect(()=>{
        let searchParams = {
            paperId: paperId,
            offset:0,
          };

          const queryParams = new URLSearchParams(Object.entries(searchParams).map(([key, value]) => [key, String(value)]));
    
        axios.get(`/api/referenceandcitations?${queryParams}`)
        .then(({data})=>{
            console.log(data.references)
            setReferences(data.references)
            setCitations(data.citations)

        })
        .catch(error=>{

        })
    },[paperId])

  return (
    <SidebarLayout>
    <div className="flex flex-row h-screen">
      
      {/* Column 1 */}
      <div className="w-4/12 overflow-auto shadow-lg rounded p-3 h-5/6">
        {/* Content for Column 1 */}
        <CardLists
                        list={[...references,...citations]}
                        titleKey="title"
                        descKey="publicationConcat"
                        // selectedCardId={selectedCard}
                        // cardClick={handleCardClick}
                        // clickPassingValue="paperId"
                    />
        </div>
      
      <div className="w-4"></div> {/* Adjust the width as needed for spacing */}

      {/* Column 2 */}
      <div className="w-8/12 overflow-auto shadow-lg rounded p-3 h-5/6">
        Visual
      </div>

    </div>

    </SidebarLayout>
  )
}
