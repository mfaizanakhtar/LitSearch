import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const MagGlassIcon = ({className}) => {
  return (
    <MagnifyingGlassIcon
        className={"h-5 w-5 text-gray-400"+" "+className}
        aria-hidden="true"
    />
  )
}

export default MagGlassIcon