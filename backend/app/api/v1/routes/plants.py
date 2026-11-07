from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import Plant, Compound
from app.data.verified_dataset import VERIFIED_PLANTS, VERIFIED_COMPOUNDS

router = APIRouter(prefix="/plants", tags=["Plants"])

@router.get("", response_model=List[Plant])
def list_plants(family: Optional[str] = None):
    """Retrieve all documented medicinal plants."""
    if family:
        return [p for p in VERIFIED_PLANTS if p.family.lower() == family.lower()]
    return VERIFIED_PLANTS

@router.get("/{plant_id}", response_model=Plant)
def get_plant(plant_id: str):
    """Get single plant details by ID or scientific name."""
    for p in VERIFIED_PLANTS:
        if p.id.lower() == plant_id.lower() or p.scientific_name.lower() == plant_id.lower():
            return p
    raise HTTPException(status_code=404, detail="Plant not found")

@router.get("/{plant_id}/compounds", response_model=List[Compound])
def get_plant_compounds(plant_id: str):
    """Get known phytochemical constituents for a given plant."""
    plant = None
    for p in VERIFIED_PLANTS:
        if p.id.lower() == plant_id.lower() or p.scientific_name.lower() == plant_id.lower():
            plant = p
            break
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    return [c for c in VERIFIED_COMPOUNDS if c.id in plant.compound_ids or plant.id in c.plant_sources]
