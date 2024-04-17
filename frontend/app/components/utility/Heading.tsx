import React from 'react'

const Heading = ({customHtmlPrefix=<></>,HeadingText=''}) => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 mb-3 flex">
        {customHtmlPrefix}
        <h3 className="text-base font-semibold leading-6 text-gray-900">{HeadingText}</h3>
    </div>
  )
}

export default Heading