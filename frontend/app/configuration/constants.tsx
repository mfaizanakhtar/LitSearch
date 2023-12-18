const SEMANTIC_SCHOLAR_BASEURL = "https://api.semanticscholar.org/graph/v1/paper"

export const relevanceSearchURI=(searchQuery,offSet)=>{
    const fields = "title,publicationDate,journal"
    const limit=20
    return SEMANTIC_SCHOLAR_BASEURL +`/search?fields=${fields}&query=${searchQuery}&limit=${limit}&offset=${offSet}`
}

export const getReferencesURI=(paperId,offSet)=>{
    const fields="abstract,title,publicationDate,journal"
    const limit=10
    return SEMANTIC_SCHOLAR_BASEURL+`/${paperId}/references?fields=${fields}&limit=${limit}&offset=${offSet}`
}

export const getCitationsURI=(paperId,offSet)=>{
    const fields="abstract,title,publicationDate,journal"
    const limit=10
    return SEMANTIC_SCHOLAR_BASEURL+`/${paperId}/citations?fields=${fields}&limit=${limit}&offset=${offSet}`
}

export const getPaperDetails=(paperId)=>{
    const fields="abstract,title,publicationDate,journal"
    return SEMANTIC_SCHOLAR_BASEURL+`/${paperId}?fields=${fields}`
}