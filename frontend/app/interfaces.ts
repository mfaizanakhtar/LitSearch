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
<<<<<<< Updated upstream
    arrayIndex?:number,
    paperEvents: PaperEvents;
=======
    index?:number
>>>>>>> Stashed changes
}

export interface User {
    login: string;
}

export interface Event {
    positive: boolean
    negative: boolean
    badge?: string
    paperId?: string
    userId?: string
}