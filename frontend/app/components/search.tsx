'use client'
import React, { Fragment, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import MagGlassIcon from '../components/utility/MagGlassIcon';
import { FaceFrownIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline';

import getState from '../state';
import { useSession } from 'next-auth/react';
import SortDropDown from './utility/SortDropDown';


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Search({setIsLoading}:any) {
    const queries = getState((state)=>state.queries)
    const searchQuery = getState((state)=>state.searchQuery)
    const uid = getState((state) => state.uid);

    const [currentQuery, setCurrentQuery] = useState('');
    const [open, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const {data : session}:any = useSession({
        required:true
      })

    const handleKeyDown = (event:any) => {
        if (event.key === 'Enter') {
            setCurrentQuery(event.target.value);
            console.log(currentQuery)
            closeModal();
            handleSearch()
        }
    }

    const handleChange = (event:any) => setCurrentQuery(event.target.value)

    const handleSearch = (clickedItem?:any) => {
        console.log(`clicked item is ${clickedItem}`)
        setIsLoading(true)
        searchQuery(clickedItem ? clickedItem : currentQuery,session?.user?.id,setIsLoading)
    };

    const filteredItems =
        currentQuery === ''
            ? queries
            : queries.filter((queriesItem) => {
                return queriesItem?.query.toLowerCase().includes(currentQuery.toLowerCase())
            })

    return <>
        <div className="relative mt-6 px-4 sm:px-6 lg:px-8 flex items-center cursor-pointer" onClick={openModal} >
            <div className='flex-grow'>
                <div className="relative">
                    <input
                        style={{ pointerEvents: 'none' }}
                        name="search"
                        id="srch"
                        placeholder=""
                        className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-10 pr-3"
                        type="text"
                        autoComplete='off'
                        value={queries.length>0 ? queries[0].query : ""}
                        readOnly={true}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <MagGlassIcon />
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-2 px-4 sm:px-6 lg:px-8 items-center cursor-pointer'>
            <div className='text-right'><SortDropDown/></div>
        </div>
        <Transition.Root show={open} as={Fragment} afterLeave={() => setCurrentQuery('')} appear>
            <Dialog as="div" className="relative z-50" onClose={setShowModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                            <Combobox onChange={(item:any) => {handleSearch(item);closeModal()}}>
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* {query === '' && (
                                    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                                        <GlobeAmericasIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                        <p className="mt-4 font-semibold text-gray-900">Search for clients and projects</p>
                                        <p className="mt-2 text-gray-500">
                                            Quickly access clients and projects by running a global search.
                                        </p>
                                    </div>
                                )} */}

                                { (
                                    <Combobox.Options static className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2">
                                        {/* {Object.entries(groups).map(([category, items]:[any,any]) => ( */}
                                            <li>
                                                {/* <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">{category}</h2> */}
                                                <ul className="mt-2 text-sm text-gray-800">
                                                    {filteredItems.map((item:any) => (
                                                        <Combobox.Option
                                                            key={item.query}
                                                            value={item.query}
                                                            // className="cursor-default select-none px-4 py-2 bg-indigo-600 text-white"
                                                            className={({ active }:any) =>
                                                                classNames('cursor-pointer select-none px-4 py-2', active && 'bg-indigo-600 text-white')
                                                            }
                                                        >
                                                            {item.query}
                                                        </Combobox.Option>
                                                    ))}
                                                </ul>
                                            </li>
                                        {/* ))} */}
                                    </Combobox.Options>
                                )}

                                {currentQuery !== '' && filteredItems.length === 0 && (
                                    <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
                                        {/* <FaceFrownIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" /> */}
                                        <p className="mt-4 font-semibold text-gray-900">Press enter for a new search</p>
                                        <p className="mt-2 text-gray-500">No Results Found in History!</p>
                                    </div>
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    </>
}
