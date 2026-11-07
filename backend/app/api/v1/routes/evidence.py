from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.models.schemas import EvidenceRecord, EvidenceCategory
from app.data.verified_dataset import VERIFIED_EVIDENCE

router = APIRouter(prefix="/evidence", tags=["EvidenceTrust & Provenance Audit"])

@router.get("", response_model=List[EvidenceRecord])
def list_evidence(category: Optional[EvidenceCategory] = None):
    """List all tracked scientific evidence records with provenance."""
    records = list(VERIFIED_EVIDENCE.values())
    if category:
        records = [r for r in records if r.category == category]
    return records

@router.get("/{evidence_id}", response_model=EvidenceRecord)
def get_evidence_detail(evidence_id: str):
    """Inspect complete provenance audit record for a specific evidence item."""
    if evidence_id in VERIFIED_EVIDENCE:
        return VERIFIED_EVIDENCE[evidence_id]
    raise HTTPException(status_code=404, detail="Evidence record not found")

@router.get("/summary/stats")
def get_evidence_stats():
    """Retrieve evidence grading distribution and data integrity statistics."""
    records = list(VERIFIED_EVIDENCE.values())
    grade_counts = {}
    category_counts = {}
    for r in records:
        grade_counts[r.confidence_grade] = grade_counts.get(r.confidence_grade, 0) + 1
        category_counts[r.category.value] = category_counts.get(r.category.value, 0) + 1

    return {
        "total_evidence_records": len(records),
        "grades": grade_counts,
        "categories": category_counts,
        "traceable_pmids_count": sum(1 for r in records if r.identifier and "PMID" in r.identifier),
        "chembl_records_count": sum(1 for r in records if r.identifier and "ChEMBL" in r.identifier)
    }
