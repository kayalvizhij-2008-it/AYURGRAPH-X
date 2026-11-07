import httpx
import xml.etree.ElementTree as ET
from typing import Dict, Any, List
from app.core.config import settings

class PubMedAdapter:
    """
    Adapter for NCBI PubMed E-utilities.
    Searches peer-reviewed literature and retrieves abstracts, citations, and publication metadata.
    """
    def __init__(self):
        self.base_url = settings.PUBMED_API_BASE
        self.cache: Dict[str, Any] = {}

    async def search_literature(self, query: str, retmax: int = 5) -> Dict[str, Any]:
        """Search PubMed articles by keyword query."""
        cache_key = f"search_{query.lower().strip()}_{retmax}"
        if cache_key in self.cache:
            return {"data": self.cache[cache_key], "source_state": "CACHED"}

        url = f"{self.base_url}/esearch.fcgi?db=pubmed&term={query}&retmode=json&retmax={retmax}"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    payload = response.json()
                    id_list = payload.get("esearchresult", {}).get("idlist", [])
                    articles = []
                    if id_list:
                        articles = await self.fetch_summaries(id_list)
                    self.cache[cache_key] = articles
                    return {"data": articles, "source_state": "LIVE", "total": payload.get("esearchresult", {}).get("count")}
        except Exception:
            pass

        return {"data": [], "source_state": "FALLBACK"}

    async def fetch_summaries(self, id_list: List[str]) -> List[Dict[str, Any]]:
        """Fetch article summaries for PubMed IDs."""
        ids_str = ",".join(id_list)
        url = f"{self.base_url}/esummary.fcgi?db=pubmed&id={ids_str}&retmode=json"
        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    result = response.json().get("result", {})
                    articles = []
                    for pmid in id_list:
                        item = result.get(pmid)
                        if item:
                            authors = [a.get("name") for a in item.get("authors", []) if "name" in a]
                            articles.append({
                                "pmid": pmid,
                                "title": item.get("title", ""),
                                "source": item.get("source", ""),
                                "pubdate": item.get("pubdate", ""),
                                "authors": ", ".join(authors[:3]) + (" et al." if len(authors) > 3 else ""),
                                "doi": item.get("articleids", [{}])[0].get("value") if item.get("articleids") else None,
                                "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
                            })
                    return articles
        except Exception:
            pass
        return []

pubmed_adapter = PubMedAdapter()
