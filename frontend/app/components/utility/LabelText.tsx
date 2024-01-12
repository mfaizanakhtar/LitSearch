import React from 'react'

const LabelText = ({text}:{text:string}) => {
  return (
    <label  className="block text-xs font-medium leading-6 text-gray-500">
                {text}
    </label>
  )
}

export default LabelText