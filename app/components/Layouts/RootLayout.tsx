import React from 'react'
import Sidebar from '../utility/Sidebar'
import MainLayoutPart from '../utility/LayoutBody'

const SidebarLayout = ({children}) => {
  return (
    <div>
        <Sidebar></Sidebar>
        <MainLayoutPart>{children}</MainLayoutPart>
    </div>
  )
}

export default SidebarLayout