import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import TextInput from '../utility/TextInput'
import projectState from '../../states/projectsState'
import genericState from '../../states/genericState'
import Modal from '../utility/Modal'
import ButtonPrimary from '../utility/ButtonPrimary'
import ButtonWhite from '../utility/ButtonWhite'

export default function CreateProject({dialogOpen,setDialogOpen}:{dialogOpen:boolean,setDialogOpen:(state:boolean)=>void}) {

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
    <>
      <Modal openState={dialogOpen} closeFunction={setDialogOpen}>
        <div className='m-4'>
          <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Create a project
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className='mt-4'><TextInput errorMsg={createProjError} placeholder={'Project Name'}  value={name} onChange={setName}/></div>
                      <div className='mt-4'><TextInput placeholder={'Project Description'} value={desc} onChange={setDesc}/></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-5 sm:mt-6">

                  <ButtonPrimary className='w-full' clickEvent={() => createProject(name,desc)}>Create</ButtonPrimary>              
                  <ButtonWhite clickEvent={() => setDialogOpen(false)} >Cancel</ButtonWhite>
          </div>
          </div>
      </Modal>
    </>
  )
}
