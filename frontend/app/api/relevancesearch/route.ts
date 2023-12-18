import { relevanceSearchURI } from "../../configuration/constants";
import { getRequest } from "../../services/axiosService";
import { NextRequest, NextResponse } from "next/server"

export const GET=async(request:NextRequest)=>{
    try {

        const searchQuery = request.nextUrl.searchParams.get("searchQuery")
        const offset = request.nextUrl.searchParams.get("offset")
        // const limit = request.nextUrl.searchParams.get("limit")
        
        let URL = relevanceSearchURI(searchQuery,offset)
        console.log(URL)

        const relevanceSearchResp = await getRequest(URL)

        const transformedSearchData = relevanceSearchResp?.data.map((data)=>{
            const publicationInfo = `${data.publicationDate?.substr(0,4) || ''} - ${data.journal?.name || ''}`.trim();
            return { ...data, publicationConcat: publicationInfo };
        })
        return NextResponse.json(transformedSearchData,{status:200})

    } catch (error) {
        return NextResponse.json(error,{status:500})
    }
}