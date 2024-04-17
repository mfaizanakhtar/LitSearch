import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

interface modal{
    openState:boolean,
    closeFunction:(state:boolean)=>void,
    afterCloseFunc?:()=>void,
    children:React.ReactNode
}

const Modal = ({openState,closeFunction,afterCloseFunc,children}:modal) => {
  return (
    <>
    <Transition.Root show={openState} as={Fragment} afterLeave={afterCloseFunc} appear>
      <Dialog as="div" className="relative z-50" onClose={closeFunction}>
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
            {children}
        </Dialog.Panel>
      </Transition.Child>
      </div>
      </Dialog>
    </Transition.Root>
    </>
  )
}

export default Modal