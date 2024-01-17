export interface PaperQueries {
    searchQuery:string,
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
    paperEvents: PaperEvents;
}

export interface PaperEvents{
    positive: boolean
    negative: boolean
    badge?: string
    paperId?: string
    userId?: string
}