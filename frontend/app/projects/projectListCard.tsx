import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import DropDown from '../components/utility/DropDown'

interface ProjectListCardProps{
  clickEvent:Function
  projectName:String|any
  projectDesc:String|any
  cardIndex:number
  isSelected?:boolean
  openConfirmationPopup:Function
}

export default function ProjectListCard({clickEvent,projectName,projectDesc,cardIndex,isSelected,openConfirmationPopup}:ProjectListCardProps) {
  return (
    <>
          <li key={projectName} className={`fade-in ${(isSelected ? 'scale-105 border-2 border-primary' : '')} hover:scale-105 transition-transform hover:border-2 hover:border-primary flex rounded-md shadow-sm w-full mt-3 ml-2 cursor-pointer`}>
            <div className="flex flex-1 items-center justify-between rounded-md border-b border-r border-t border-l border-gray-200 bg-white">
              <div onClick={()=>clickEvent(projectName,cardIndex)} className="flex-1 truncate px-4 py-2 text-sm">
                <div className="font-medium text-gray-900 hover:text-gray-600 ">
                  {projectName}
                </div>
                {/* <p className="text-gray-500">{project.members} Members</p> */}
                <p className="text-gray-500 text-xs">{projectDesc}</p>
                {/* <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {projectRole}
                </span> */}
              </div>
              <div className="flex-shrink-0 pr-2">
                <DropDown 
                  position='left'
                  dropDownArray={[{clickEvent:()=>{openConfirmationPopup(projectName)},name:"Remove project"}]}                            
                  btnHtml={<EllipsisVerticalIcon className='cursor-pointer h-5 w-5' ></EllipsisVerticalIcon>}
                  // heading='Add or remove'
                />
              </div>
            </div>
          </li>
          </>
  )
}
