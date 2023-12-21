export interface Paper {
    pid: string;
    title: string;
    index?:number
    paperEvents: PaperEvents;
}

export interface PaperEvents{
    positive: boolean
    negative: boolean
    badge?: string
    paperId?: string
    userId?: string
}