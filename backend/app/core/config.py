import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AYURGRAPH-X"
    PROJECT_DESCRIPTION: str = "BioCultural Intelligence & Discovery Platform — Connecting Traditional Knowledge with Molecular Science"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # External APIs
    PUBCHEM_API_BASE: str = os.getenv("PUBCHEM_API_BASE", "https://pubchem.ncbi.nlm.nih.gov/rest/pug")
    CHEMBL_API_BASE: str = os.getenv("CHEMBL_API_BASE", "https://www.ebi.ac.uk/chembl/api/data")
    GBIF_API_BASE: str = os.getenv("GBIF_API_BASE", "https://api.gbif.org/v1")
    PUBMED_API_BASE: str = os.getenv("PUBMED_API_BASE", "https://eutils.ncbi.nlm.nih.gov/entrez/eutils")
    NCBI_API_KEY: str = os.getenv("NCBI_API_KEY", "")
    REQUEST_TIMEOUT_SECONDS: int = int(os.getenv("REQUEST_TIMEOUT_SECONDS", "8"))

settings = Settings()
