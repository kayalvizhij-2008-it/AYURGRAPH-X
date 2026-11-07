import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

class PubChemAdapter:
    """
    Adapter for NCBI PubChem PUG REST API.
    Provides chemical structure resolution, SMILES, 2D depictions, and physicochemical properties.
    """
    def __init__(self):
        self.base_url = settings.PUBCHEM_API_BASE
        self.cache: Dict[str, Any] = {}

    async def get_compound_by_name(self, name: str) -> Dict[str, Any]:
        """Fetch compound details by chemical name from PubChem."""
        cache_key = f"name_{name.lower().strip()}"
        if cache_key in self.cache:
            return {"data": self.cache[cache_key], "source_state": "CACHED"}

        url = f"{self.base_url}/compound/name/{name}/JSON"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    payload = response.json()
                    props = self._parse_pubchem_json(payload)
                    self.cache[cache_key] = props
                    return {"data": props, "source_state": "LIVE"}
        except Exception:
            pass

        return {"data": None, "source_state": "FALLBACK"}

    async def get_compound_by_cid(self, cid: int) -> Dict[str, Any]:
        """Fetch compound details by PubChem CID."""
        cache_key = f"cid_{cid}"
        if cache_key in self.cache:
            return {"data": self.cache[cache_key], "source_state": "CACHED"}

        url = f"{self.base_url}/compound/cid/{cid}/property/MolecularWeight,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,IUPACName,CanonicalSMILES/JSON"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    payload = response.json()
                    props = payload.get("PropertyTable", {}).get("Properties", [{}])[0]
                    parsed = {
                        "pubchem_cid": cid,
                        "molecular_weight": props.get("MolecularWeight"),
                        "logp": props.get("XLogP"),
                        "tpsa": props.get("TPSA"),
                        "h_bond_donors": props.get("HBondDonorCount"),
                        "h_bond_acceptors": props.get("HBondAcceptorCount"),
                        "rotatable_bonds": props.get("RotatableBondCount"),
                        "iupac_name": props.get("IUPACName"),
                        "canonical_smiles": props.get("CanonicalSMILES"),
                        "depiction_url": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/PNG"
                    }
                    self.cache[cache_key] = parsed
                    return {"data": parsed, "source_state": "LIVE"}
        except Exception:
            pass

        return {"data": None, "source_state": "FALLBACK"}

    def _parse_pubchem_json(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            compound = payload["PC_Compounds"][0]
            cid = compound["id"]["id"]["cid"]
            return {
                "pubchem_cid": cid,
                "depiction_url": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/PNG"
            }
        except Exception:
            return {}

pubchem_adapter = PubChemAdapter()
