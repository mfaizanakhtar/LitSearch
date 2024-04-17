import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Modal from './Modal';

interface ConfirmationDialogProps {
    isOpen: boolean; 
    onClose: (state:boolean) => void; 
    onConfirm: () => void; 
    children: React.ReactNode; 
  }
  
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, children}:ConfirmationDialogProps) => {

  return (
    <>
    <Modal openState={isOpen} closeFunction={onClose}>
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
      </Modal>
    </>
  );
};

export default ConfirmationDialog
