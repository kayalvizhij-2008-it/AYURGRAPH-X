from fastapi import APIRouter, Query, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.models.schemas import LiteratureSnippet, LiteratureReviewRequest
from app.services.literature_extractor import literature_extractor
from app.services.data_sources.pubmed import pubmed_adapter

router = APIRouter(prefix="/literature", tags=["Knowledge Miner & Literature Extraction"])

class ExtractRequest(BaseModel):
    text: str
    title: Optional[str] = "Ad-hoc User Submission"
    pmid: Optional[str] = None

@router.get("/snippets", response_model=List[LiteratureSnippet])
def get_snippets():
    """Retrieve all candidate and verified literature snippets."""
    return literature_extractor.get_all_snippets()

@router.post("/extract")
def extract_entities(req: ExtractRequest):
    """Run rule-based transparent NER extraction on text."""
    entities = literature_extractor.extract_from_text(req.text)
    return {
        "status": "Awaiting Human Verification",
        "title": req.title,
        "pmid": req.pmid,
        "extracted_entities": entities,
        "confidence": "Rule-Based Candidate (Unverified)"
    }

@router.post("/review")
def review_snippet(req: LiteratureReviewRequest):
    """Allow researcher to Accept, Reject, or Correct candidate relationships."""
    return literature_extractor.review_snippet(req)

@router.get("/search")
async def search_literature(q: str = Query("Withania somnifera neuroprotection", description="PubMed query")):
    """Search PubMed live and retrieve verified paper metadata."""
    res = await pubmed_adapter.search_literature(q, retmax=6)
    return res
