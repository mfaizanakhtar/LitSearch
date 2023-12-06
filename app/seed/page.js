'use client'
import SidebarLayout from '../components/Layouts/RootLayout'
import React, { useState } from 'react';
import Modal from '../components/utility/Modal';
import Loader from '../components/utility/Loader';
import TextInput from '../components/utility/TextInput';
import MagGlassIcon from '../components/utility/MagGlassIcon';
import ButtonPrimary from '../components/utility/ButtonPrimary';
import CardLists from '../components/utility/CardLists';
import axios from 'axios';

const page = () => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = () => setShowModal(false);

    const [inputText, setInputText] = useState('');
    const [relevanceResults, setRelevanceResults] = useState([]);
    const [relevantSearchLoading,setRelevantSearchLoading] = useState(false)    

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSearch = () => {
        setRelevanceResults([])
        setRelevantSearchLoading(true)

        let searchParams = {
            searchQuery: inputText,
            fields: "title,publicationDate,journal",
            offset:0,
            limit:20
          };

        const queryParams = new URLSearchParams(searchParams);
    
        axios.get(`/api/semanticAuthor/relevanceSearch?${queryParams}`)
        .then((data)=>{
            console.log(data)
            setRelevantSearchLoading(false)
            setRelevanceResults(data.data); // Update your state with the response data
        })
        .catch(error=>{

        })
    };

  return (
    <SidebarLayout>
        <div className="relative mt-2 flex items-center cursor-pointer" onClick={openModal}>
            <TextInput
                style={{ pointerEvents: 'none'}}
                name="search"
                id="search"
                placeholder="Search with article, author or topic"
            />
            <MagGlassIcon
                className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2"
            />
        </div>

        <Modal show={showModal} onClose={closeModal}>
        {/* Search and button */}
            <div className="relative mt-2 flex items-center">
                <div className='flex-grow'>
                    <div className="relative">
                        <TextInput
                            type="text"
                            name="search"
                            id="search"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Search with article, author or topic"
                            className="pl-10 pr-3"
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <MagGlassIcon/>
                        </div>
                    </div>
                </div>
                <div>
                    <ButtonPrimary clickEvent={handleSearch} btnText="Search"/>
                </div>
            </div>
            {/* Search Details Card */}
                <div className="border-t border-gray-200 m-3 p-3 h-5/6 overflow-y-scroll">
                    {relevantSearchLoading ? <Loader /> : null}
                    <CardLists
                        list={relevanceResults}
                        titleKey="title"
                        descKey="publicationConcat"
                    />
                </div>
        </Modal>
    </SidebarLayout>
  )
}

export default page