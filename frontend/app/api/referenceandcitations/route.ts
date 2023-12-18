import { NextRequest, NextResponse } from "next/server";
import { getCitationsURI, getPaperDetails, getReferencesURI } from "../../configuration/constants";
import { getRequest } from "../../services/axiosService";
import PaperArticle from "../../models/article";
import dbConnect from "../../services/mongooseService";

export const GET=async(request:NextRequest)=>{
    try{
        const paperId = request.nextUrl.searchParams.get("paperId")
        const offset = request.nextUrl.searchParams.get("offset")

        let referencesURI = getReferencesURI(paperId,offset)
        const referencesResp = await getRequest(referencesURI)

        let citationsURI = getCitationsURI(paperId,offset)
        const citationsResp = await getRequest(citationsURI)

        let paperDetailsURI = getPaperDetails(paperId)
        const paperResp = await getRequest(paperDetailsURI)

        const transformedReferences = referencesResp?.data.map((data)=>{
            const publicationInfo = `${data.citedPaper.publicationDate?.substr(0,4) || ''} - ${data.citedPaper.journal?.name || ''}`.trim();
            return { ...data.citedPaper, publicationConcat: publicationInfo };
        })

        const transformedCitations = citationsResp?.data.map((data)=>{
            const publicationInfo = `${data.citingPaper.publicationDate?.substr(0,4) || ''} - ${data.citingPaper.journal?.name || ''}`.trim();
            return { ...data.citingPaper, publicationConcat: publicationInfo };
        })

        await dbConnect()
        try{
            const paperArticle = new PaperArticle({
                paperId:paperResp.paperId,
                title:paperResp.title,
                abstract:paperResp.abstract
            })
    
            await paperArticle.save()
            const referencesInsertion = await PaperArticle.insertMany(transformedReferences)
            console.log(referencesInsertion)
            await PaperArticle.insertMany(transformedCitations)
        }catch(error){
            console.log(error)
        }

        return NextResponse.json({references:transformedReferences,citations:transformedCitations},{status:200})
    }catch(error){
        return NextResponse.json(error,{status:500})
    }
}