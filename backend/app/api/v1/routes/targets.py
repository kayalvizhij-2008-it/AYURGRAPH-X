from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Target
from app.data.verified_dataset import VERIFIED_TARGETS

router = APIRouter(prefix="/targets", tags=["Biological Targets"])

@router.get("", response_model=List[Target])
def list_targets():
    """List all biological targets."""
    return VERIFIED_TARGETS

@router.get("/{target_id}", response_model=Target)
def get_target(target_id: str):
    """Get target details by ID or gene symbol."""
    for t in VERIFIED_TARGETS:
        if t.id.lower() == target_id.lower() or t.gene_symbol.lower() == target_id.lower():
            return t
    raise HTTPException(status_code=404, detail="Target not found")
