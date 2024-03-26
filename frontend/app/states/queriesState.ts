import { create } from 'zustand'
import axios from "axios"
import {Events, Paper, Project, Queries, SortType} from '../interfaces'

interface QueriesState {
    session: string
    uid: string
    cmdOpened: boolean
    detailView:boolean
    detailPagePaper:Paper | any
    queries:Array<Queries>
    sortType:SortType

    setSortType:(sortField:'Year',sortType:'asc'|'desc'|'relevance')=>void

    searchQuery:(query:string,userId:any,loaderCallback:any)=>void
    setQueries:(queries:Array<Queries>)=>void
    setEvent:(arrayIndex:number,event:Events,callback?:any)=>void
    // fetch: (uid: string) => void
    isDetailView: (status:boolean)=>void
    setDetailPagePaper : (paper:Paper)=>void
}

const queriesState = create<QueriesState>()((set) => ({
    session: '',
    uid: '',
    cmdOpened: false,
    selectedNav:'Search',
    detailView:false,
    detailPagePaper:{},
    queries:[],
    sortType:{sortField:'Year',sortOrder:'relevance'},
    setSortType:(sortField:'Year',sortOrder:'asc'|'desc'|'relevance' = 'relevance')=>set(()=>{
        return {sortType:{sortField:sortField,sortOrder:sortOrder}}
    }),
    setQueries: (queries: Array<Queries>) => set((state) => {
        let updatedPapersQueries: Array<Queries> = [...state.queries];
        updatedPapersQueries.unshift(...queries);
        return { queries: updatedPapersQueries};
    }),
    setEvent: async(arrayIndex:number,event:Events,callBack?:any)=>{
        debugger
        let queries:Array<Queries>=[]
        let eventRequest:Events={}
        set((state)=>{
                queries = state.queries
                console.log(queries)

            let paper = queries[0].papers[arrayIndex]

            eventRequest={
                ...event,
                paperId:paper.paperId,
                query:queries[0].query
            }

            if(event.type=='upvoted'){
                paper.upvoted = paper.upvoted ? !paper.upvoted : true
                paper.downvoted = false
                eventRequest.data = paper.upvoted
                queries[0].papers[arrayIndex] = paper
            }else if(event.type=='downvoted'){
                paper.downvoted = paper.downvoted ? !paper.downvoted : true
                paper.upvoted = false
                eventRequest.data = paper.downvoted
                queries[0].papers.splice(arrayIndex,1)
                queries[0].papers.push(paper)
            }
        return {queries:[...queries]}
        })

        let {data}:any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/paper/event`,eventRequest)
        let relevantPapers = data?.relevantPapers?.map((paper:any)=>({...paper,journalName:paper.journal?.name}))
        if(relevantPapers){
            // const map = new Map<string, Paper>();
            const papersSet = new Set<string>();
            queries[0].papers.forEach((item:any) => papersSet.add(item.paperId));
            // queries[0].papers.forEach((item:any) => map.set(item.paperId, item));
    
            let mergedPapers: Paper[]=[]
            relevantPapers.forEach((item:any) => {
            if (!papersSet.has(item.paperId)) {
                mergedPapers.push(item)
            }
            });
            mergedPapers=mergedPapers.concat(queries[0].papers)
            queries[0].papers=mergedPapers
            console.log(queries)
            set(()=>({queries:[...queries]}))
    
            if (callBack) callBack(relevantPapers.length)
        }


    },
    searchQuery:async(query:string,userId:any,loaderCallback:any)=>{
        debugger
        let queriesArray:Array<Queries>=[]
         set((state)=>{
            queriesArray=state.queries
            return state
        })
        let queriesItemIndex = queriesArray.findIndex((q)=>q.query==query)
        if(queriesItemIndex!=-1 && queriesArray[queriesItemIndex].papers?.length>0){
            let queriesItem:Queries = queriesArray[queriesItemIndex]
            queriesArray.splice(queriesItemIndex,1)
            queriesArray.unshift(queriesItem)
            set(()=>({queries:[...queriesArray]}))
            loaderCallback(false)
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/search?query=${query}&userId=${userId}&isExistingQuery=true`)
        }else{
            let {data:queriesResponse} =await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/search?query=${query}&userId=${userId}`)
            queriesResponse.papers = queriesResponse?.papers?.map((paper:any)=>({...paper,journalName:paper?.journal?.name}))
            if(queriesItemIndex!=-1){
                let queriesItemToSwap = {...queriesArray[queriesItemIndex],papers:queriesResponse.papers}
                queriesArray.splice(queriesItemIndex,1)
                queriesArray.unshift(queriesItemToSwap)
            }else{
                let queriesItem:Queries={query:query,papers:queriesResponse.papers}
                queriesArray.unshift(queriesItem)
            }
            set(()=>({queries:queriesArray}))
            loaderCallback(false)
        }
    },
    isDetailView: (status:boolean)=>set(()=>({detailView: status})),
    setDetailPagePaper: (paper:Paper)=>set(()=>({detailPagePaper:paper})),
}))

export default queriesState;