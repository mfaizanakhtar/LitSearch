import requests


SEMANTIC_SCHOLAR_BASEURL = "https://api.semanticscholar.org/graph/v1/paper"
FIELDS = "title,publicationDate,journal,referenceCount,citationCount,abstract,venue"
LIMIT, OFFSET = 20, 0


async def fetch_references_citation(paperId:str):
    REFERENCES_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/references?fields={FIELDS}&offset=0&limit=10'
    CITATIONS_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/{paperId}/citations?fields={FIELDS}&offset=0&limit=10'
    referencesResp = requests.get(REFERENCES_URL,headers={'x-api-key':'IwS2rC34Rm2PvIG17qnhv8IUIm2z4dPv967WR9pF'}).json()
    citationsResp = requests.get(CITATIONS_URL).json()

    simplified_paper_obj = [{**paper["citedPaper"], "parentId": paperId} for paper in referencesResp["data"]] + [{**paper["citingPaper"],"parentId":paperId} for paper in citationsResp["data"]]
    return simplified_paper_obj

async def get_search_result(query:str):
        SEARCH_URL=f'{SEMANTIC_SCHOLAR_BASEURL}/search?fields={FIELDS}&query={query.replace(" ", "%20")}&limit={LIMIT}&offset={OFFSET}'
        response = requests.get(SEARCH_URL,headers={'x-api-key':'IwS2rC34Rm2PvIG17qnhv8IUIm2z4dPv967WR9pF'})
        print(f'semantic scholar response: {response.json()}')
        return response