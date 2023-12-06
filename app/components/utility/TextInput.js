'use client'
import React from 'react'

const TextInput = ({name,id,placeholder,value,onChange,style,className}) => {
  return (
    <input
        style={style}
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={"block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"+" "+className}
    />
  )
}

export default TextInput