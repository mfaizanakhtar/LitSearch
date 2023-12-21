import React from 'react'
import { HandThumbDownIcon as HandThumbDownIconSolid} from '@heroicons/react/20/solid'
import { HandThumbDownIcon as HandThumbDownIconOutline} from '@heroicons/react/24/outline'


const ThumbDownIcon = ({iconStatus=false,clickEvent}:any) => {
  return (
    <>
    {iconStatus ? 
        <HandThumbDownIconSolid onClick={clickEvent}
        className='cursor-pointer h-5 w-5 text-red-600'
    />:
        <HandThumbDownIconOutline onClick={clickEvent}
        className='cursor-pointer h-5 w-5 text-red-600'
        />
    }
    </>
  )
}

export default ThumbDownIcon