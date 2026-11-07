from fastapi import APIRouter, Query, Body
from typing import List, Optional
from pydantic import BaseModel
from app.models.schemas import ResearchHypothesis
from app.services.ranking_engine import ranking_engine

router = APIRouter(prefix="/hypotheses", tags=["Hypothesis Studio & Explainable Discovery"])

class HypothesisQueryRequest(BaseModel):
    plant_id: Optional[str] = None
    disease_id: Optional[str] = None
    min_confidence: Optional[float] = 50.0

@router.get("", response_model=List[ResearchHypothesis])
def get_ranked_hypotheses(
    plant_id: Optional[str] = Query(None, description="Filter by Plant ID"),
    disease_id: Optional[str] = Query(None, description="Filter by Disease ID")
):
    """
    Generate and rank research hypotheses using the explainable multi-factor ranking algorithm.
    """
    return ranking_engine.generate_hypotheses(plant_id=plant_id, disease_id=disease_id)

@router.post("/generate", response_model=List[ResearchHypothesis])
def generate_custom_hypotheses(req: HypothesisQueryRequest):
    """Generate hypotheses for user-specified constraints."""
    return ranking_engine.generate_hypotheses(plant_id=req.plant_id, disease_id=req.disease_id)
