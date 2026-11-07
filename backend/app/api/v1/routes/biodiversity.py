from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from app.data.verified_dataset import VERIFIED_PLANTS
from app.services.data_sources.gbif import gbif_adapter

router = APIRouter(prefix="/biodiversity", tags=["BioGuard & Biodiversity Intelligence"])

@router.get("/{plant_id}")
async def get_biodiversity_profile(plant_id: str):
    """
    Retrieve biodiversity conservation profile, GBIF occurrences, and cultivation-first guidance.
    Safeguards: Sensitive species coordinates are generalized/fuzzed.
    """
    plant = next((p for p in VERIFIED_PLANTS if p.id.lower() == plant_id.lower() or p.scientific_name.lower() == plant_id.lower()), None)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    is_sensitive = plant.conservation and plant.conservation.status_code in ["VU", "EN", "CR"]

    occurrences_data = []
    source_state = "VERIFIED_SAMPLE"
    if plant.gbif_taxon_key:
        gbif_res = await gbif_adapter.get_occurrences(plant.gbif_taxon_key, limit=20, is_sensitive=is_sensitive)
        occurrences_data = gbif_res.get("data", [])
        source_state = gbif_res.get("source_state", "VERIFIED_SAMPLE")

    return {
        "plant_id": plant.id,
        "scientific_name": plant.scientific_name,
        "family": plant.family,
        "conservation_assessment": plant.conservation,
        "geographic_distribution": plant.geographic_distribution,
        "habitat_description": plant.habitat_description,
        "gbif_taxon_key": plant.gbif_taxon_key,
        "is_sensitive_species": is_sensitive,
        "occurrences": occurrences_data,
        "source_state": source_state,
        "responsible_conservation_note": "Coordinates for threatened taxa are protected and generalized to administrative boundaries in compliance with the Nagoya Protocol and CITES biodiversity conservation ethics."
    }
