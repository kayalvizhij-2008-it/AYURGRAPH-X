from fastapi import APIRouter, HTTPException, Query, Response
from typing import Dict, Any
import json
from datetime import datetime
from app.models.schemas import ResearchDossier
from app.services.graph_engine import graph_engine
from app.services.ranking_engine import ranking_engine
from app.data.verified_dataset import VERIFIED_PLANTS, VERIFIED_DISEASES

router = APIRouter(prefix="/dossier", tags=["Research Dossier Export"])

@router.get("/generate", response_model=ResearchDossier)
def generate_dossier(
    plant_id: str = Query("PLANT_001", description="Medicinal Plant ID"),
    disease_id: str = Query("DIS_001", description="Disease ID")
):
    """
    Generate an auditable Research Dossier ready for laboratory evaluation,
    including the 8-stage evidence pathway, hypothesis breakdown, provenance citations, and ethical disclaimer.
    """
    plant = next((p for p in VERIFIED_PLANTS if p.id == plant_id), None)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    disease = next((d for d in VERIFIED_DISEASES if d.id == disease_id), None)
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    pathway = graph_engine.generate_pathway(plant_id, disease_id)
    hypotheses = ranking_engine.generate_hypotheses(plant_id=plant_id, disease_id=disease_id)
    top_hyp = hypotheses[0] if hypotheses else ranking_engine.generate_hypotheses()[0]

    dossier = ResearchDossier(
        dossier_id=f"DOSSIER_{plant_id}_{disease_id}_{int(datetime.now().timestamp())}",
        generated_at=datetime.now().isoformat(),
        research_question=f"Does {plant.scientific_name} constituent {top_hyp.compound_name} attenuate {disease.name} via {top_hyp.target_name}?",
        target_entity={
            "plant_id": plant.id,
            "scientific_name": plant.scientific_name,
            "family": plant.family,
            "disease_id": disease.id,
            "disease_name": disease.name,
            "therapeutic_area": disease.therapeutic_area
        },
        pathway=pathway,
        hypothesis=top_hyp,
        sources_and_licences=[
            {"source": "PubMed / NCBI E-utilities", "licence": "Public Domain / Open Access", "role": "Peer-reviewed literature verification"},
            {"source": "EMBL-EBI ChEMBL 34", "licence": "CC BY-SA 3.0", "role": "Direct experimental bioactivity metrics"},
            {"source": "NCBI PubChem PUG REST", "licence": "Public Domain", "role": "Chemical identity & 2D structures"},
            {"source": "GBIF Biodiversity Facility", "licence": "CC BY 4.0 / CC0", "role": "Species distribution records"},
            {"source": "IMPPAT 3.0 Reference", "licence": "CC BY-NC-ND 4.0 (Non-commercial research)", "role": "Baseline traditional Ayurvedic text citations"}
        ],
        limitations=[
            "Data primarily reflects in vitro biochemical assays and murine animal models.",
            "Human clinical efficacy cannot be inferred without dedicated Phase I/II trials.",
            "Traditional formulations may involve matrix excipient effects not replicated by isolated phytochemical compounds."
        ],
        disclaimer="AYURGRAPH-X RESEARCH INTELLIGENCE DOSSIER: This document is produced strictly for academic and preclinical laboratory hypothesis generation. It does not constitute medical advice or clinical claims."
    )
    return dossier

@router.get("/download/json")
def download_dossier_json(
    plant_id: str = Query("PLANT_001"),
    disease_id: str = Query("DIS_001")
):
    """Download research dossier as a structured JSON file."""
    dossier = generate_dossier(plant_id=plant_id, disease_id=disease_id)
    json_bytes = json.dumps(dossier.model_dump(), indent=2).encode("utf-8")
    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=ayurgraph_dossier_{plant_id}.json"}
    )
