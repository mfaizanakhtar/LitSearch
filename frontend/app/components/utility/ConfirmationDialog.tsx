import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean; 
    onClose: (state:boolean) => void; 
    onConfirm: () => void; 
    children: React.ReactNode; 
  }
  
export default ({ isOpen, onClose, onConfirm, children}:ConfirmationDialogProps) => {

  return (
    <>
    <Transition.Root show={isOpen} as={Fragment} appear>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <div className="">
                <div className="flex items-end justify-center pt-4 px-4 text-center sm:block sm:p-0">
                  {/* Background overlay, show modal when isOpen is true */}

                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span className="hidden sm:inline-block sm:align-middle" aria-hidden="true">&#8203;</span>

                  {/* Modal panel, show modal when isOpen is true */}
                  <div className="align-bottom bg-white rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:w-full sm:p-6">
                    <div>
                      {children}
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                          Confirm
                        </button>
                        <button type="button" onClick={()=>{onClose(false)}} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          </Dialog.Panel>
      </Transition.Child>
      </div>
      </Dialog>
    </Transition.Root>
    </>
  );
};
