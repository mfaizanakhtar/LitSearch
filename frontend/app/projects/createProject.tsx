import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import TextInput from '../components/utility/TextInput'
import projectState from '../states/projectsState'
import genericState from '../states/genericState'

export default function CreateProject({dialogOpen,setDialogOpen}:{dialogOpen:boolean,setDialogOpen:any}) {
//   const [open, setOpen] = useState(true)

    const [name,setName] = useState('')
    const [desc,setDesc] = useState('')
    const [createProjError,setCreateProjectError] = useState('')
    const {addNewProject} = projectState()
    const {userObj} = genericState()

    useEffect(()=>{
        setTimeout(()=>{
            setName('');setDesc('')
        },300)
    },[dialogOpen])

    const createProject = async (projectName:any,projectDescription:any)=>{
      debugger
      if(!projectName){
          setCreateProjectError('Project name can not be empty')
          return;
      } 
      let errorResp = await addNewProject({name:projectName,desc:projectDescription},userObj)
      if(errorResp) setCreateProjectError(errorResp)
      else{
          setCreateProjectError('')
          console.log(projectName,projectDescription)
          setDialogOpen(false)
      }
    }

  return (
    <Transition.Root show={dialogOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={setDialogOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Create a project
                    </Dialog.Title>
                    <div className="mt-2">
                      {/* <p className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                      </p> */}
                      <div className='mt-4'><TextInput errorMsg={createProjError} placeholder={'Project Name'}  value={name} onChange={setName}/></div>
                      <div className='mt-4'><TextInput placeholder={'Project Description'} value={desc} onChange={setDesc}/></div>
                    </div>
                  </div>
                </div>
                <div className="flex mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="mr-2 inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => createProject(name,desc)}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 border-gray-400 border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
