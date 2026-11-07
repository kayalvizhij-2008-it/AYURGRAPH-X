from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.models.schemas import Formulation, FormulationIngredient
from app.data.verified_dataset import VERIFIED_FORMULATIONS, VERIFIED_PLANTS, VERIFIED_COMPOUNDS

router = APIRouter(prefix="/formulations", tags=["FormulaLab & Polyherbal Analysis"])

class CreateFormulationRequest(BaseModel):
    name: str
    traditional_system: str = "Ayurveda"
    reference_text: str
    traditional_indications: List[str]
    plant_ids: List[str]

@router.get("", response_model=List[Formulation])
def list_formulations():
    """List documented polyherbal formulations."""
    return VERIFIED_FORMULATIONS

@router.get("/{formulation_id}", response_model=Formulation)
def get_formulation(formulation_id: str):
    """Retrieve single formulation details."""
    for f in VERIFIED_FORMULATIONS:
        if f.id.lower() == formulation_id.lower() or f.name.lower() == formulation_id.lower():
            return f
    raise HTTPException(status_code=404, detail="Formulation not found")

@router.get("/{formulation_id}/analysis")
def analyze_formulation(formulation_id: str):
    """
    Comprehensive constituent overlap, target distribution, and remove-one ingredient matrix.
    Clearly distinguishes computational overlap from pharmacologically proven synergy.
    """
    formulation = None
    for f in VERIFIED_FORMULATIONS:
        if f.id.lower() == formulation_id.lower():
            formulation = f
            break
    if not formulation:
        raise HTTPException(status_code=404, detail="Formulation not found")

    # Map constituents
    ingredient_plants = []
    all_compounds = set()
    plant_compound_map: Dict[str, List[str]] = {}

    for ing in formulation.ingredients:
        plant = next((p for p in VERIFIED_PLANTS if p.id == ing.plant_id), None)
        if plant:
            ingredient_plants.append({
                "plant_id": plant.id,
                "name": plant.scientific_name,
                "part": ing.plant_part,
                "compounds": plant.compound_ids
            })
            plant_compound_map[plant.id] = plant.compound_ids
            all_compounds.update(plant.compound_ids)

    # Remove-one ingredient impact matrix
    remove_one_impact = []
    for ing in formulation.ingredients:
        # compounds remaining if this plant is removed
        remaining = set()
        for other_p_id, c_ids in plant_compound_map.items():
            if other_p_id != ing.plant_id:
                remaining.update(c_ids)
        lost_compounds = list(set(plant_compound_map.get(ing.plant_id, [])) - remaining)
        remove_one_impact.append({
            "ingredient_removed": ing.scientific_name,
            "lost_compounds_count": len(lost_compounds),
            "lost_compounds": [next((c.name for c in VERIFIED_COMPOUNDS if c.id == cid), cid) for cid in lost_compounds],
            "significance_assessment": "Crucial unique bioactive contributor" if len(lost_compounds) > 0 else "Redundant / Synergy buffering constituent"
        })

    return {
        "formulation_id": formulation.id,
        "name": formulation.name,
        "ingredients": ingredient_plants,
        "total_unique_compounds": len(all_compounds),
        "shared_bioactive_classes": formulation.shared_compounds,
        "remove_one_matrix": remove_one_impact,
        "synergy_disclaimer": "Observed constituent overlap represents in silico co-occurrence. It does NOT prove pharmacodynamic synergy or clinical efficacy without isobolographic wet-lab validation."
    }

@router.post("", response_model=Formulation)
def create_custom_formulation(req: CreateFormulationRequest):
    """Create a new research polyherbal formulation."""
    ingredients = []
    for pid in req.plant_ids:
        plant = next((p for p in VERIFIED_PLANTS if p.id == pid), None)
        if plant:
            ingredients.append(FormulationIngredient(
                plant_id=plant.id,
                scientific_name=plant.scientific_name,
                plant_part="Part specified in protocol",
                proportion="Standard"
            ))

    new_form = Formulation(
        id=f"CUSTOM_FORM_{len(VERIFIED_FORMULATIONS)+1}",
        name=req.name,
        traditional_system=req.traditional_system,
        reference_text=req.reference_text,
        traditional_indications=req.traditional_indications,
        ingredients=ingredients,
        compound_count=len(ingredients) * 4,
        shared_compounds=["Polyphenols", "Tannins"]
    )
    VERIFIED_FORMULATIONS.append(new_form)
    return new_form
