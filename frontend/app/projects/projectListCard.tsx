import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

export default function ProjectListCard({clickEvent,projectName,projectDesc,cardIndex,isSelected}:{clickEvent:Function,projectName:String|any,projectDesc:String|any,cardIndex:number,isSelected?:boolean}) {
  return (
    <>
      {/* <h2 className="text-sm font-medium text-gray-500">Pinned Projects</h2> */}
          <li key={projectName} className={`${(isSelected ? 'scale-105 border-2 border-primary' : '')} hover:scale-105 transition-transform hover:border-2 hover:border-primary flex rounded-md shadow-sm w-full mt-3 ml-2 cursor-pointer`}>
            {/* <div
              className={classNames(
                project.bgColor
                'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
              )}
            >
              {project.initials}
            </div> */}
            <div className="flex flex-1 items-center justify-between rounded-md border-b border-r border-t border-l border-gray-200 bg-white">
              <div onClick={()=>clickEvent(projectName,cardIndex)} className="flex-1 truncate px-4 py-2 text-sm">
                <div className="font-medium text-gray-900 hover:text-gray-600 ">
                  {projectName}
                </div>
                {/* <p className="text-gray-500">{project.members} Members</p> */}
                <p className="text-gray-500 text-xs">{projectDesc}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {'owner'}
                </span>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
          </>
  )
}
