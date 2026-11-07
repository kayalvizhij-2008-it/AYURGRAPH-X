from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.models.schemas import Compound, BioactivityRecord, DataSourceState
from app.data.verified_dataset import VERIFIED_COMPOUNDS
from app.services.data_sources.pubchem import pubchem_adapter
from app.services.data_sources.chembl import chembl_adapter

router = APIRouter(prefix="/compounds", tags=["Phytochemical Compounds"])

@router.get("", response_model=List[Compound])
def list_compounds(chemical_class: Optional[str] = None):
    """List documented phytochemicals."""
    if chemical_class:
        return [c for c in VERIFIED_COMPOUNDS if chemical_class.lower() in (c.chemical_class or "").lower()]
    return VERIFIED_COMPOUNDS

@router.get("/{compound_id}", response_model=Compound)
async def get_compound(compound_id: str):
    """Retrieve detailed compound record by ID or CID."""
    for c in VERIFIED_COMPOUNDS:
        if c.id.lower() == compound_id.lower() or str(c.pubchem_cid) == compound_id or c.name.lower() == compound_id.lower():
            # If PubChem properties are requested live, enrich seamlessly
            if c.pubchem_cid:
                live_res = await pubchem_adapter.get_compound_by_cid(c.pubchem_cid)
                if live_res.get("source_state") == "LIVE" and live_res.get("data"):
                    c.data_source_state = DataSourceState.LIVE
            return c
    raise HTTPException(status_code=404, detail="Compound not found")

@router.get("/{compound_id}/bioactivity")
async def get_compound_bioactivity(compound_id: str):
    """Fetch experimental bioactivity targets and IC50/Ki values."""
    compound = None
    for c in VERIFIED_COMPOUNDS:
        if c.id.lower() == compound_id.lower() or str(c.pubchem_cid) == compound_id:
            compound = c
            break
    if not compound:
        raise HTTPException(status_code=404, detail="Compound not found")

    # Fetch live ChEMBL bioactivities if chembl_id exists
    live_bioactivities = []
    source_state = "VERIFIED_SAMPLE"
    if compound.chembl_id:
        chembl_res = await chembl_adapter.get_bioactivity_by_chembl_id(compound.chembl_id, limit=5)
        if chembl_res.get("source_state") == "LIVE" and chembl_res.get("data"):
            live_bioactivities = chembl_res.get("data")
            source_state = "LIVE"

    return {
        "compound_id": compound.id,
        "compound_name": compound.name,
        "chembl_id": compound.chembl_id,
        "curated_bioactivities": compound.bioactivities,
        "live_chembl_records": live_bioactivities,
        "source_state": source_state
    }
