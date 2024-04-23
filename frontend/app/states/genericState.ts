import { create } from "zustand"
import { userSessionObj } from "../interfaces"

interface GenericState {
    displayMode:'query' | 'project'

    searchDisplay:string
    setSearchDisplay:(searchString:string)=>void

    userObj:userSessionObj
    setUserObj:(userObj:userSessionObj)=>void

    userId:string | null
    setUserId:(userId:string)=>void
    setDisplayMode:(displayMode:'query' | 'project')=>void
}

export default create<GenericState>()((set)=>({
    displayMode:'query',

    userObj:{userId:null,userName:null,userImage:null},
    setUserObj:(userObj:userSessionObj)=>set(()=>({userObj:userObj})),

    searchDisplay:'',
    setSearchDisplay:(searchString:string)=>set(()=>({searchDisplay:searchString})),

    userId:null,
    setUserId:(userId:string)=>set(()=>({userId:userId})),
    setDisplayMode:(displayMode:'query'|'project')=>set(()=>({displayMode:displayMode}))
}))