from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Pathway, Disease
from app.data.verified_dataset import VERIFIED_PATHWAYS, VERIFIED_DISEASES

router = APIRouter(prefix="/pathways", tags=["Biological Pathways & Diseases"])

@router.get("", response_model=List[Pathway])
def list_pathways():
    """List all biological pathways."""
    return VERIFIED_PATHWAYS

@router.get("/diseases", response_model=List[Disease])
@router.get("/diseases/all", response_model=List[Disease])
def list_diseases():
    """List all mapped disease indications."""
    return VERIFIED_DISEASES

@router.get("/{pathway_id}", response_model=Pathway)
def get_pathway(pathway_id: str):
    """Get pathway by ID."""
    for pw in VERIFIED_PATHWAYS:
        if pw.id.lower() == pathway_id.lower():
            return pw
    raise HTTPException(status_code=404, detail="Pathway not found")
