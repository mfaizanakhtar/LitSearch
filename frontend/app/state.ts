import { create } from 'zustand'
import {Paper} from './interfaces'

interface State {
    session: string
    query: string
    cmdOpened: boolean
    papers: Array<Paper>
    detailView:boolean
    detailPagePaper:Paper | any
    add: (papers: Array<Paper>) => void
    updatePaper: (index:any,eventValues:any) => void
    isDetailView: (status:boolean)=>void
    setDetailPagePaper : (paper:Paper)=>void
    // childPaperUpdate: (childIndex:any,parentIndex:any,eventValues:any) => void
}

const getState = create<State>()((set) => ({
    session: '',
    query: '',
    cmdOpened: false,
    papers: [],
    detailView:false,
    detailPagePaper:{},
    add: (papers: Array<Paper>) => set((state) => ({ papers: papers.concat(state.papers) })),
    updatePaper: (index:any, eventValues:any) => set((state) => {
        let updatedPapers = [...state.papers];
        updatedPapers[index] = { ...updatedPapers[index], ...eventValues };
        if(eventValues.paperEvents.negative){
            const paperElement = updatedPapers[index]
            updatedPapers.splice(index,1)
            updatedPapers.push(paperElement)
        }
        return { papers: updatedPapers };
    }),
    isDetailView: (status:boolean)=>set(()=>({detailView:status})),
    setDetailPagePaper: (paper:Paper)=>set(()=>({detailPagePaper:paper}))
}))

export default getState;