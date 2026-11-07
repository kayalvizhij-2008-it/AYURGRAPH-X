import re
from typing import Dict, Any, List
from app.models.schemas import LiteratureSnippet, LiteratureReviewRequest
from app.data.verified_dataset import VERIFIED_LITERATURE_SNIPPETS

# Controlled vocabulary dictionaries for rule-based extraction
KNOWN_PLANTS = {
    "withania somnifera": "Withania somnifera",
    "ashwagandha": "Withania somnifera",
    "curcuma longa": "Curcuma longa",
    "turmeric": "Curcuma longa",
    "haridra": "Curcuma longa",
    "azadirachta indica": "Azadirachta indica",
    "neem": "Azadirachta indica",
    "ocimum sanctum": "Ocimum tenuiflorum",
    "ocimum tenuiflorum": "Ocimum tenuiflorum",
    "tulsi": "Ocimum tenuiflorum",
    "zingiber officinale": "Zingiber officinale",
    "ginger": "Zingiber officinale",
    "shunthi": "Zingiber officinale"
}

KNOWN_COMPOUNDS = {
    "withaferin a": "Withaferin A",
    "withanolide a": "Withanolide A",
    "withanolide d": "Withanolide D",
    "curcumin": "Curcumin",
    "demethoxycurcumin": "Demethoxycurcumin",
    "bisdemethoxycurcumin": "Bisdemethoxycurcumin",
    "azadirachtin": "Azadirachtin",
    "gedunin": "Gedunin",
    "nimbin": "Nimbin",
    "eugenol": "Eugenol",
    "rosmarinic acid": "Rosmarinic Acid",
    "ursolic acid": "Ursolic Acid",
    "6-gingerol": "6-Gingerol",
    "6-shogaol": "6-Shogaol",
    "piperine": "Piperine"
}

KNOWN_TARGETS = {
    "nf-kb": "NFKB1",
    "nf-kappa b": "NFKB1",
    "nfkb1": "NFKB1",
    "hsp90": "HSP90AA1",
    "hsp90aa1": "HSP90AA1",
    "acetylcholinesterase": "ACHE",
    "ache": "ACHE",
    "ptgs2": "PTGS2",
    "cox-2": "PTGS2",
    "cyclooxygenase-2": "PTGS2",
    "alox5": "ALOX5",
    "5-lipoxygenase": "ALOX5",
    "trpv1": "TRPV1"
}

KNOWN_DISEASES = {
    "neurodegeneration": "Neurodegenerative Disorders",
    "alzheimer": "Alzheimer's Disease Cognitive Deficit",
    "arthritis": "Chronic Inflammatory Arthropathies",
    "inflammation": "Chronic Inflammation",
    "asthma": "Bronchial Asthma",
    "pain": "Peripheral Neuropathic Pain",
    "ulcer": "Ulcerative Lesions"
}

class LiteratureExtractor:
    def __init__(self):
        # In-memory store initialized with verified snippets
        self.snippets: Dict[str, LiteratureSnippet] = {s.id: s for s in VERIFIED_LITERATURE_SNIPPETS}

    def extract_from_text(self, text: str) -> Dict[str, List[str]]:
        """Transparent rule-based NER extractor."""
        lowered = text.lower()
        extracted = {
            "plants": [],
            "compounds": [],
            "targets": [],
            "diseases": []
        }

        for pattern, canon in KNOWN_PLANTS.items():
            if re.search(r"\b" + re.escape(pattern) + r"\b", lowered):
                if canon not in extracted["plants"]:
                    extracted["plants"].append(canon)

        for pattern, canon in KNOWN_COMPOUNDS.items():
            if re.search(r"\b" + re.escape(pattern) + r"\b", lowered):
                if canon not in extracted["compounds"]:
                    extracted["compounds"].append(canon)

        for pattern, canon in KNOWN_TARGETS.items():
            if re.search(r"\b" + re.escape(pattern) + r"\b", lowered):
                if canon not in extracted["targets"]:
                    extracted["targets"].append(canon)

        for pattern, canon in KNOWN_DISEASES.items():
            if re.search(r"\b" + re.escape(pattern) + r"\b", lowered):
                if canon not in extracted["diseases"]:
                    extracted["diseases"].append(canon)

        return extracted

    def get_all_snippets(self) -> List[LiteratureSnippet]:
        return list(self.snippets.values())

    def review_snippet(self, req: LiteratureReviewRequest) -> Dict[str, Any]:
        """Human-in-the-loop acceptance, rejection, or correction."""
        if req.snippet_id not in self.snippets:
            return {"success": False, "error": "Snippet not found"}

        snippet = self.snippets[req.snippet_id]
        if req.action == "accept":
            snippet.verification_status = "Accepted"
            snippet.annotated_by = f"Researcher (Verified: {req.reviewer_notes or 'Approved'})"
        elif req.action == "reject":
            snippet.verification_status = "Rejected"
            snippet.annotated_by = f"Researcher (Rejected: {req.reviewer_notes or 'Spurious correlation'})"
        elif req.action == "correct" and req.corrected_entities:
            snippet.extracted_entities = req.corrected_entities
            snippet.verification_status = "Accepted"
            snippet.annotated_by = f"Researcher (Corrected: {req.reviewer_notes or 'Manual correction'})"

        return {"success": True, "snippet": snippet}

literature_extractor = LiteratureExtractor()
