import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

interface DropDown{
  name: string;
  seperator?:boolean;
  clickEvent: () => void;
}

interface DropDownProps {
  dropDownArray: DropDown[];
  heading?:string
  btnHtml?:any, // either pass html ( to customize the look )
  btnText?:string // or pass only the text and use predefined styling
}

export default function DropDown({ dropDownArray,btnHtml,btnText,heading }: DropDownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className='h-2 w-15'>
        {btnHtml ? 
        <Menu.Button>
          {btnHtml}
        </Menu.Button>
         :
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {btnText}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
        }
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
        <Menu.Items className="ml-7 -mt-1 absolute z-30  w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        { heading ? <div className={`py-1 border-b-2 border-gray-100`}>
              <Menu.Item>
                <div
                  className={'text-gray-700 block px-4 py-2 text-sm'}
                >
                  <strong>{heading}</strong>
                </div>
            </Menu.Item>
            </div> : <></>}
            {dropDownArray.map((item:DropDown)=>(
              <div className={`py-1 ${item.seperator ? 'border-b-2 border-gray-100' : ''}`}>
              <Menu.Item>
              {({ active }) => (
                <div
                onClick={item.clickEvent}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  {item.name}
                </div>
              )}
            </Menu.Item>
            </div>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}