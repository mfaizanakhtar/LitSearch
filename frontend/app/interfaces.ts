export interface Queries {
    query:string,
    papers:Paper[]
}

export interface Paper {
    paperId: string;
    title: string;
    citationCount:number,
    referenceCount:number,
    publicationDate:string,
    journalName:string,
    venue:string,
    arrayIndex?:number,
    index?:number,
    upvoted?:boolean,
    downvoted?:boolean
}

export interface User {
    login: string;
}

export interface Events{
    paperId?:string,
    userId?:string,
    type?:'upvoted' | 'downvoted',
    data?:boolean,
    query?:string
}

export interface SortType{
    sortField?:'Year',
    sortOrder?:'asc'|'desc'|'relevance'
}

export interface Project{
    name?:string,
    desc?:string,
    detailsFetched?:boolean,
    team?:Array<{userId:string,role:string,image?:string,name?:string,userDetails?:any}>,
    papers?:Array<{paperId:String}>
}
// export interface Event {
//     upvoted: boolean
//     downvoted: boolean
//     badge?: string
//     paperId?: string
//     userId?: string
// }