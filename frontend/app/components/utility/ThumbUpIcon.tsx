import React from 'react'
import { HandThumbUpIcon as HandThumbUpIconSolid} from '@heroicons/react/20/solid'
import { HandThumbUpIcon as HandThumbUpIconOutline} from '@heroicons/react/24/outline'


const ThumbUpIcon = ({iconStatus=false,clickEvent}:any) => {
  console.log("IconStatus :" + iconStatus)
  return (
    <>
    {iconStatus ? 
        <HandThumbUpIconSolid onClick={clickEvent}
        className='cursor-pointer h-5 w-5 text-primary'
        />
        :
        <HandThumbUpIconOutline onClick={clickEvent}
        className='cursor-pointer h-5 w-5 text-primary'
        />
    }
    </>
  )
}

export default ThumbUpIcon