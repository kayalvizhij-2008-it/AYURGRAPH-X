from fastapi import APIRouter, Query
from typing import Optional
from app.models.schemas import KnowledgeGraphResponse, EvidenceToDiscoveryPathway
from app.services.graph_engine import graph_engine

router = APIRouter(prefix="/graph", tags=["Knowledge Graph & Pathway Explorer"])

@router.get("", response_model=KnowledgeGraphResponse)
def get_graph():
    """Retrieve full ethnopharmacology knowledge graph formatted for Cytoscape.js."""
    return graph_engine.get_full_graph()

@router.get("/subgraph/{entity_id}", response_model=KnowledgeGraphResponse)
def get_subgraph(entity_id: str, depth: int = Query(1, ge=1, le=3)):
    """Retrieve neighborhood ego-network around a specific plant, compound, target, or disease."""
    return graph_engine.get_subgraph(entity_id, depth=depth)

@router.get("/pathway", response_model=EvidenceToDiscoveryPathway)
def get_evidence_pathway(
    plant_id: str = Query("PLANT_001", description="Medicinal Plant ID"),
    disease_id: str = Query("DIS_001", description="Disease ID")
):
    """
    Signature Feature: Generate the 8-stage interactive Evidence-to-Discovery Pathway:
    Traditional Use -> Medicinal Plant -> Plant Part -> Phytochemical -> Biological Target -> Pathway -> Disease Evidence -> Research Hypothesis
    """
    return graph_engine.generate_pathway(plant_id, disease_id)
