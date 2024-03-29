import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import getState from '@/app/state'

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}


export default function SortDropDown() {

    const [sortByText,setSortByText]=useState('Sort By - Relevance')
    const setSortType = getState((state)=>state.setSortType)


    const sortByYear = (sortType:'asc'|'desc'|'relevance') =>{
        if(sortType=='asc'){
            setSortByText('Sort By - Year Ascending')
        }else if (sortType=='desc'){
            setSortByText('Sort By - Year Descending')
        }else if(sortType=='relevance'){
          setSortByText('Sort By - Relevance')
        }
        setSortType("Year",sortType)
    } 

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className='h-2 w-15'>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {sortByText}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
          <Menu.Item>
              {({ active }) => (
                <div
                onClick={()=>{sortByYear('relevance')}}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Relevance
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                onClick={()=>{sortByYear('asc')}}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Year Ascending
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                onClick={()=>{sortByYear('desc')}}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Year Descending
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
