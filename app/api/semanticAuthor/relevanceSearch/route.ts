import { getRelevanceSearch } from "../../../services/semanticScholarService";
import { NextRequest, NextResponse } from "next/server"

const stopWords = ['and', 'or', 'but', 'with', 'the', 'a', 'an', 'in', 'on', 'at', 'to'];

export const GET=async(request:NextRequest)=>{
    try {

        const searchQuery = request.nextUrl.searchParams.get("searchQuery")
        const fields = request.nextUrl.searchParams.get("fields")
        const offset = request.nextUrl.searchParams.get("offset")
        const limit = request.nextUrl.searchParams.get("limit")

        const words = searchQuery.split(/\s+/);
        const filteredWords = words.filter(word => !stopWords.includes(word.toLowerCase()));
        const relevantPhrases = filteredWords.join(' ');

        let searchParams = {
            query:relevantPhrases,
            fields:fields,
            offset:offset,
            limit:limit
          };

        const relevanceSearchResp = await getRelevanceSearch(searchParams)

        const transformedSearchData = relevanceSearchResp?.data.map((data)=>{
            const publicationInfo = `${data.publicationDate?.substr(0,4) || ''} - ${data.journal?.name || ''}`.trim();
            return { ...data, publicationConcat: publicationInfo };
        })
        return NextResponse.json(transformedSearchData,{status:200})

    } catch (error) {
        return NextResponse.json(error,{status:500})
    }

    // return NextResponse.json({response:"error occured"},{status:500})
}