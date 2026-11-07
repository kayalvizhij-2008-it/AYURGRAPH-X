import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings

class ChEMBLAdapter:
    """
    Adapter for EMBL-EBI ChEMBL API.
    Provides experimental bioactivity lookup (IC50, Ki, EC50), target mechanisms, and assay citations.
    """
    def __init__(self):
        self.base_url = settings.CHEMBL_API_BASE
        self.cache: Dict[str, Any] = {}

    async def get_bioactivity_by_chembl_id(self, chembl_id: str, limit: int = 10) -> Dict[str, Any]:
        """Fetch experimental bioactivities for a molecule."""
        cache_key = f"bio_{chembl_id}_{limit}"
        if cache_key in self.cache:
            return {"data": self.cache[cache_key], "source_state": "CACHED"}

        url = f"{self.base_url}/activity.json?molecule_chembl_id={chembl_id}&limit={limit}"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    payload = response.json()
                    activities = []
                    for act in payload.get("activities", []):
                        val = act.get("value")
                        activities.append({
                            "chembl_activity_id": act.get("activity_id"),
                            "assay_chembl_id": act.get("assay_chembl_id"),
                            "target_chembl_id": act.get("target_chembl_id"),
                            "target_pref_name": act.get("target_pref_name", "Unknown Target"),
                            "standard_type": act.get("standard_type"),
                            "standard_relation": act.get("standard_relation", "="),
                            "standard_value": float(val) if val else None,
                            "standard_units": act.get("standard_units"),
                            "pubmed_id": act.get("document_chembl_id")
                        })
                    self.cache[cache_key] = activities
                    return {"data": activities, "source_state": "LIVE"}
        except Exception:
            pass

        return {"data": [], "source_state": "FALLBACK"}

    async def get_target_details(self, target_chembl_id: str) -> Dict[str, Any]:
        """Fetch target protein details and organism."""
        cache_key = f"tgt_{target_chembl_id}"
        if cache_key in self.cache:
            return {"data": self.cache[cache_key], "source_state": "CACHED"}

        url = f"{self.base_url}/target/{target_chembl_id}.json"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    parsed = {
                        "chembl_target_id": target_chembl_id,
                        "pref_name": data.get("pref_name"),
                        "target_type": data.get("target_type"),
                        "organism": data.get("organism")
                    }
                    self.cache[cache_key] = parsed
                    return {"data": parsed, "source_state": "LIVE"}
        except Exception:
            pass

        return {"data": None, "source_state": "FALLBACK"}

chembl_adapter = ChEMBLAdapter()
