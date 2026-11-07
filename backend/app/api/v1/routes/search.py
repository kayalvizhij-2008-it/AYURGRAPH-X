from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.data.verified_dataset import (
    VERIFIED_PLANTS, VERIFIED_COMPOUNDS, VERIFIED_TARGETS,
    VERIFIED_PATHWAYS, VERIFIED_DISEASES, VERIFIED_FORMULATIONS
)

router = APIRouter(prefix="/search", tags=["Global Scientific Search"])

@router.get("")
def global_search(q: str = Query(..., min_length=1, description="Search query")):
    """
    Unified scientific search distinguishing:
    - Botanical plants and synonyms
    - Traditional names
    - Phytochemical compounds
    - Biological targets
    - Pathways
    - Diseases
    - Polyherbal formulations
    """
    term = q.lower().strip()
    results: Dict[str, List[Dict[str, Any]]] = {
        "plants": [],
        "compounds": [],
        "targets": [],
        "pathways": [],
        "diseases": [],
        "formulations": []
    }

    # 1. Search Plants
    for p in VERIFIED_PLANTS:
        matched = False
        match_type = "Scientific Name"
        if term in p.scientific_name.lower():
            matched = True
        elif any(term in cn.lower() for cn in p.common_names):
            matched = True
            match_type = "Common Name"
        elif any(term in syn.name.lower() for syn in p.synonyms):
            matched = True
            match_type = "Botanical Synonym"
        elif any(term in tn["name"].lower() for tn in p.traditional_names):
            matched = True
            match_type = "Traditional Name"

        if matched:
            results["plants"].append({
                "id": p.id,
                "title": p.scientific_name,
                "subtitle": f"{p.family} • {', '.join(p.common_names[:2])}",
                "match_type": match_type,
                "url": f"/plants/{p.id}"
            })

    # 2. Search Compounds
    for c in VERIFIED_COMPOUNDS:
        if term in c.name.lower() or (c.chemical_class and term in c.chemical_class.lower()) or (c.canonical_smiles and term in c.canonical_smiles.lower()):
            results["compounds"].append({
                "id": c.id,
                "title": c.name,
                "subtitle": f"{c.chemical_class or 'Phytochemical'} • PubChem CID: {c.pubchem_cid or 'N/A'}",
                "match_type": "Compound",
                "url": f"/phytodiscover?compound={c.id}"
            })

    # 3. Search Targets
    for t in VERIFIED_TARGETS:
        if term in t.gene_symbol.lower() or term in t.full_name.lower():
            results["targets"].append({
                "id": t.id,
                "title": t.gene_symbol,
                "subtitle": t.full_name,
                "match_type": "Target",
                "url": f"/targets/{t.id}"
            })

    # 4. Search Pathways
    for pw in VERIFIED_PATHWAYS:
        if term in pw.name.lower():
            target_plant = "PLANT_001"
            if pw.id == "PW_004":
                target_plant = "PLANT_002"
            elif pw.id == "PW_005":
                target_plant = "PLANT_005"
            results["pathways"].append({
                "id": pw.id,
                "title": pw.name,
                "subtitle": f"{pw.database} • {pw.external_id or ''}",
                "match_type": "Pathway",
                "url": f"/pathway?plant={target_plant}"
            })

    # 5. Search Diseases
    for d in VERIFIED_DISEASES:
        if term in d.name.lower() or term in d.therapeutic_area.lower():
            target_plant = "PLANT_001"
            if d.id == "DIS_002":
                target_plant = "PLANT_002"
            elif d.id == "DIS_007":
                target_plant = "PLANT_005"
            results["diseases"].append({
                "id": d.id,
                "title": d.name,
                "subtitle": d.therapeutic_area,
                "match_type": "Disease",
                "url": f"/pathway?plant={target_plant}&disease={d.id}"
            })

    # 6. Search Formulations
    for f in VERIFIED_FORMULATIONS:
        if term in f.name.lower() or any(term in ind.lower() for ind in f.traditional_indications):
            results["formulations"].append({
                "id": f.id,
                "title": f.name,
                "subtitle": f"{f.traditional_system} • {f.reference_text}",
                "match_type": "Formulation",
                "url": f"/formulalab?id={f.id}"
            })

    total_hits = sum(len(v) for v in results.values())
    return {
        "query": q,
        "total_hits": total_hits,
        "results": results
    }
