import { create } from 'zustand'
import axios from "axios"
import {Events, Paper, Project, Queries, SortType} from '../interfaces'
import { getRandomPosition } from '../helper'

interface QueriesState {
    detailView:boolean
    detailPagePaper:Paper | any
    queries:Array<Queries>
    sortType:SortType
    sortedPapers:Paper[],
    nodesAndLinks:{nodes:{id:string,x?:number,y?:number,actualYear?:string}[],links:{source:string,target:string,type:string}[]}

    setSortType:(sortField:'Year',sortType:'asc'|'desc'|'relevance')=>void
    setSortedPapers:(paper:Paper[])=>void

    searchQuery:(query:string,userId:any,loaderCallback:any)=>void|any
    setQueries:(queries:Array<Queries>)=>void
    setEvent:(arrayIndex:number,event:Events,callback?:any)=>void

    isDetailView: (status:boolean)=>void
    setDetailPagePaper : (paper:Paper)=>void

    highlightAndScrollToPaper : (paperId:string)=>void
    revertHightLight:(paperId:string)=>void
}

const queriesState = create<QueriesState>()((set) => ({
    detailView:false,
    detailPagePaper:{},
    queries:[],
    sortType:{sortField:'Year',sortOrder:'relevance'},
    sortedPapers:[],
    nodesAndLinks:{nodes:[],links:[]},
    highlightAndScrollToPaper: (paperId) =>set((state)=>{
        const SortedPapers = state.sortedPapers
        const updatedSortedPapers = SortedPapers.map((paper)=>(paper.paperId==paperId ? {...paper,isHovered:true} : paper))
        //--scroll code--//
        const element = document.getElementById(paperId);

        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - 130; //offset for header
        
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        return {sortedPapers:updatedSortedPapers}
    }) ,
    revertHightLight:(paperId)=>set((state)=>{
        const SortedPapers = state.sortedPapers
        const updatedSortedPapers = SortedPapers.map((paper)=>(paper.paperId==paperId ? {...paper,isHovered:false} : paper))
        return {sortedPapers:updatedSortedPapers}
    }),
    setSortedPapers:(sortedPapers:Paper[])=>set(()=>{
        debugger
        let links:any=[]
        let papersMap:{ [key: string]: Paper }={}

        sortedPapers.forEach((paper)=>{
            papersMap[paper.paperId] = paper
        })
        
        let linksAdded = new Set() // Keep record if link is created either by reference/citations

        for(let paper of sortedPapers as Paper[]){
            for(let paperRef of paper.references || []){
                let sourceDestConcat=paperRef.paperId+paper.paperId //for record keeping insertion of link
                if(papersMap[paperRef.paperId] && !linksAdded.has(sourceDestConcat)){ //check if any reference paper is already in our paperList and check link does not already exist
                    links.push({"source":paperRef.paperId,"target":paper.paperId,"type":"references"})
                    linksAdded.add(sourceDestConcat)
                }
            }
            for(let paperCitation of paper.citations || []){
                let sourceDestConcat=paper.paperId+paperCitation.paperId //for record keeping insertion of link
                if(papersMap[paperCitation.paperId] && !linksAdded.has(sourceDestConcat)){ //check if any citation paper is already in our paperList and check link does not already exist
                    links.push({"source":paper.paperId,"target":paperCitation.paperId,"type":"citations"})
                    linksAdded.add(sourceDestConcat)
                }
            }
        }
        const minYear = Object.values(papersMap).reduce((minYear, paper) => {
            // Check if publicationDate exists and compare it with the current minYear found.
            const date = new Date(paper.publicationDate);
            let year = date.getFullYear(); // year is a number
            if (paper.publicationDate && (minYear === 0 || year < minYear)) {
                minYear = year;
            }
            return minYear;
        }, 0);

        let nodes:{id:string,x:number,y:number,actualYear?:string}[] = Object.values(papersMap).map((paper:any)=>{
            let year=minYear
            if(paper.publicationDate){
                const date = new Date(paper.publicationDate);
                year = date.getFullYear(); // year is a number
                return {id:paper.paperId,y:paper.citationCount,x:year} 
            }
            return {id:paper.paperId,y:paper.citationCount,x:year,actualYear:'No Data'}
        })
        let nodesAndLinks = {nodes:nodes,links:links}
        return {sortedPapers:sortedPapers,nodesAndLinks:nodesAndLinks}
    }),
    setSortType:(sortField:'Year',sortOrder:'asc'|'desc'|'relevance' = 'relevance')=>set(()=>{
        return {sortType:{sortField:sortField,sortOrder:sortOrder}}
    }),

    setQueries: (queries: Array<Queries>) => set((state) => {
        let updatedPapersQueries: Array<Queries> = [...state.queries];
        updatedPapersQueries.unshift(...queries);
        return { queries: updatedPapersQueries};
    }),
    setEvent: async(arrayIndex:number,event:Events,callBack?:any)=>{
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
            let {data:queriesResponse} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/paper/search?query=${query}&userId=${userId}`)
            queriesResponse.papers = queriesResponse?.papers?.map((paper:any)=>({...paper,journalName:paper?.journal?.name}))
            if(queriesItemIndex!=-1){
                let queriesItemToSwap = {...queriesArray[queriesItemIndex],papers:queriesResponse.papers}
                queriesArray.splice(queriesItemIndex,1)
                queriesArray.unshift(queriesItemToSwap)
            }else{
                let queriesItem:Queries={_id:queriesResponse._id,query:query,papers:queriesResponse.papers}
                queriesArray.unshift(queriesItem)
            }
            set(()=>({queries:queriesArray}))
            loaderCallback(false)
            return queriesResponse
        }
    },
    isDetailView: (status:boolean)=>set(()=>({detailView: status})),
    setDetailPagePaper: (paper:Paper)=>set(()=>({detailPagePaper:paper})),
}))

export default queriesState;