import { create } from 'zustand'
import axios from "axios"
import {Paper, PaperQueries} from './interfaces'


interface State {
    session: string
    query: string
    setQuery: (query: string) => void
    uid: string
    cmdOpened: boolean
    papers: Array<Paper>
    detailView:boolean
    detailPagePaper:Paper | any
    paperQueries:Array<PaperQueries>
    searchQueries:Array<string>
    currentSearchQuery:string | any
    setSearchQueriesHistory:(queries:string[])=>void
    addNewQueryToSearchQryList:(query:string,userId:any)=>void
    moveQueryUpwards:(index:number)=>void
    setPaperQueries:(paperQueries:PaperQueries)=>void
    addPapersToCurrentQuery: (papers: Array<Paper>) => void
    updatePaper: (index:any,eventValues:any) => void
    fetch: (uid: string) => void
    isDetailView: (status:boolean)=>void
    setDetailPagePaper : (paper:Paper)=>void
}

const getState = create<State>()((set) => ({
    session: '',
    query: '',
    uid: '',
    cmdOpened: false,
    papers: [],
    detailView:false,
    detailPagePaper:{},
    paperQueries:[],
    searchQueries: [],
    currentSearchQuery:null,
    setSearchQueriesHistory:(queries:string[])=>set(()=>({searchQueries:queries})),
    addNewQueryToSearchQryList:(query:any,userId:any)=>set((state)=>{
        console.log(query)
        let updatedSearchQueries = [...state.searchQueries]
        let queryFound = updatedSearchQueries.findIndex((curQuery)=>curQuery==query)
        if(queryFound!=-1){
            updatedSearchQueries.splice(queryFound,1)
            //To update the index for query last used for persistence
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/paper/search?query=${query}&userId=${userId}&isExistingQuery=true`)
        }
        updatedSearchQueries.unshift(query)
        return {searchQueries:updatedSearchQueries}
    }),
    moveQueryUpwards:(index:number)=>set((state)=>{
        let updatedPapersQueries: Array<PaperQueries> = [...state.paperQueries];
        let paperQueryObjToMove = updatedPapersQueries[index]
        updatedPapersQueries.splice(index,1)
        updatedPapersQueries.unshift(paperQueryObjToMove)
        return { paperQueries: updatedPapersQueries, papers: updatedPapersQueries[0].papers,currentSearchQuery:updatedPapersQueries[0].searchQuery };
    }),
    setPaperQueries: (paperQueries: PaperQueries) => set((state) => {
        let updatedPapersQueries: Array<PaperQueries> = [...state.paperQueries];
        updatedPapersQueries.unshift(paperQueries);
        if( paperQueries && paperQueries.papers){
            return { paperQueries: updatedPapersQueries, papers: paperQueries.papers,currentSearchQuery:paperQueries.searchQuery };
        }
        else return state
    }),
    addPapersToCurrentQuery: (newPapers: Array<Paper>) => set((state) => {
        let updatedPapersQueries: Array<PaperQueries> = [...state.paperQueries];
        let currentPapers = state.papers
        const map = new Map<string, Paper>();

        currentPapers.forEach(item => map.set(item.paperId, item));
        let mergedPapers: Paper[]=[]
        newPapers.forEach(item => {
        if (!map.has(item.paperId)) {
            mergedPapers.push(item)
        }
        });
        mergedPapers=mergedPapers.concat(currentPapers)
        updatedPapersQueries[0].papers=mergedPapers
        return {paperQueries:updatedPapersQueries,papers:mergedPapers}
    }),
    updatePaper: (index:any, eventValues:any) => set((state) => {
        let updatedPapers = [...state.papers]
        let paperQueries = state.paperQueries
        updatedPapers[index].paperEvents = eventValues.paperEvents
        if(eventValues.paperEvents.negative){
            const paperElement = updatedPapers[index]
            updatedPapers.splice(index,1)
            updatedPapers.push(paperElement)
            paperQueries[0].papers=updatedPapers
        }
        return { papers: updatedPapers,paperQueries:paperQueries };
    }),
    fetch: async (uid: string) => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${uid}`);
        const update = await response.data;
        console.log(update);
        set(() => ({query: update['query'], papers: update['papers']}));
      },
    isDetailView: (status:boolean)=>set(()=>({detailView: status})),
    setDetailPagePaper: (paper:Paper)=>set(()=>({detailPagePaper:paper})),
    setQuery: (query: string) => set(()=>({query: query})),
}))

export default getState;