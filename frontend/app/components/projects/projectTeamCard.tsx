import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

interface projectTeamCard{
  userId?:string
  name?:string,
  role:string,
  image?:string
}

export default function ProjectTeamCard({userId,name,role,image}:projectTeamCard) {
  return (
    <>
    {/* <ul role="list" className="flex flex-row gap-6 overflow-x-auto"> */}

      {/* {people.map((person) => ( */}
        <li
        //   className='flex-none divide-y divide-gray-200 rounded-lg bg-white text-center shadow m-1'
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow fade-in"
        >
          <div className="flex flex-1 flex-col p-3">
            <img className="mx-auto h-10 w-10 flex-shrink-0 rounded-full" src={image} alt="" />
            <h3 className="mt-3 text-xs font-medium text-gray-900">{name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              {/* <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">{person.title}</dd> */}
              <dt className="sr-only">Role</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {role}
                </span>
              </dd>
            </dl>
          </div>
        </li>
    </>
  )
}
