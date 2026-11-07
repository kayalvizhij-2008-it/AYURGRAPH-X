from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class EvidenceCategory(str, Enum):
    DIRECT_EXPERIMENTAL = "Direct Experimental Evidence"
    CURATED_DATABASE = "Curated Database Evidence"
    PEER_REVIEWED_LITERATURE = "Peer-Reviewed Literature Association"
    COMPUTATIONAL_PREDICTION = "Computational Prediction"
    MACHINE_EXTRACTED = "Machine-Extracted Candidate"
    UNVERIFIED_HYPOTHESIS = "Unverified Hypothesis"

class DataSourceState(str, Enum):
    LIVE = "LIVE"
    CACHED = "CACHED"
    VERIFIED_SAMPLE = "VERIFIED_SAMPLE"

class RelationshipType(str, Enum):
    SYNONYM_OF = "SYNONYM_OF"
    HAS_PART = "HAS_PART"
    TRADITIONALLY_USED_FOR = "TRADITIONALLY_USED_FOR"
    CONTAINS_COMPOUND = "CONTAINS_COMPOUND"
    PART_OF_FORMULATION = "PART_OF_FORMULATION"
    TESTED_AGAINST = "TESTED_AGAINST"
    TARGETS = "TARGETS"
    INVOLVED_IN = "INVOLVED_IN"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"
    DOCUMENTED_IN = "DOCUMENTED_IN"
    OCCURS_IN = "OCCURS_IN"
    HAS_CONSERVATION_STATUS = "HAS_CONSERVATION_STATUS"
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"

# ----------------- Evidence Model -----------------
class EvidenceRecord(BaseModel):
    id: str
    source_name: str
    source_url: Optional[str] = None
    identifier: Optional[str] = None # e.g. PMID: 19800773, ChEMBL: CHEMBL25
    publication_date: Optional[str] = None
    category: EvidenceCategory
    directness: str = "Direct" # "Direct" or "Indirect"
    origin: str = "Experimental" # "Experimental", "Computational", "Curated", "Literature"
    confidence_grade: str = "A" # A (Robust experimental), B (Curated), C (In vitro/indirect), D (Computational), E (Unverified)
    supporting_text: str
    contradictory_findings: Optional[str] = None
    limitations: Optional[str] = None
    licence_info: str = "Open Access / Public Domain"
    retrieval_date: Optional[str] = "2026-11-06"

# ----------------- Core Entities -----------------
class BotanicalSynonym(BaseModel):
    name: str
    author: Optional[str] = None
    status: str = "Synonym" # "Accepted", "Synonym", "Orthographic"

class TraditionalUse(BaseModel):
    id: str
    system: str # "Ayurveda", "Siddha", "Unani", "Folk"
    use_name: str
    traditional_indication: str
    plant_part: str
    formulation_type: Optional[str] = None
    source_citation: str
    evidence_id: Optional[str] = None

class ConservationAssessment(BaseModel):
    status_code: str # "LC", "VU", "EN", "CR", "DD", "NE"
    status_label: str # "Least Concern", "Vulnerable", "Endangered", "Data Deficient"
    assessment_year: Optional[int] = None
    threat_summary: Optional[str] = None
    cultivation_recommendation: str = "Cultivation-first priority to prevent wild depletion"
    source: str = "IUCN Red List / Regional Threat Registry"

class Plant(BaseModel):
    id: str
    scientific_name: str
    family: str
    common_names: List[str] = []
    traditional_names: List[Dict[str, str]] = [] # [{"language": "Sanskrit", "name": "Ashwagandha"}]
    synonyms: List[BotanicalSynonym] = []
    plant_parts: List[str] = []
    habitat_description: Optional[str] = None
    geographic_distribution: List[str] = []
    conservation: Optional[ConservationAssessment] = None
    traditional_uses: List[TraditionalUse] = []
    compound_ids: List[str] = []
    data_source_state: DataSourceState = DataSourceState.VERIFIED_SAMPLE
    powo_id: Optional[str] = None
    gbif_taxon_key: Optional[int] = None

class ChemicalProperty(BaseModel):
    molecular_weight: Optional[float] = None
    logp: Optional[float] = None
    h_bond_donors: Optional[int] = None
    h_bond_acceptors: Optional[int] = None
    tpsa: Optional[float] = None
    rotatable_bonds: Optional[int] = None

class BioactivityRecord(BaseModel):
    id: str
    target_id: str
    target_name: str
    assay_type: str # "Binding", "Functional", "Inhibition"
    activity_type: str # "IC50", "Ki", "EC50", "Kd"
    activity_value: Optional[float] = None
    activity_unit: Optional[str] = None
    relation: str = "="
    pubmed_id: Optional[str] = None
    chembl_assay_id: Optional[str] = None
    source_name: str = "ChEMBL"
    is_experimental: bool = True

class Compound(BaseModel):
    id: str
    name: str
    iupac_name: Optional[str] = None
    canonical_smiles: Optional[str] = None
    pubchem_cid: Optional[int] = None
    chembl_id: Optional[str] = None
    chemical_class: Optional[str] = None # e.g. "Steroidal lactone", "Diarylmheptanoid"
    properties: Optional[ChemicalProperty] = None
    plant_sources: List[str] = [] # list of plant_ids
    plant_parts_detected: List[str] = []
    bioactivities: List[BioactivityRecord] = []
    data_source_state: DataSourceState = DataSourceState.VERIFIED_SAMPLE

class Target(BaseModel):
    id: str
    gene_symbol: str
    full_name: str
    uniprot_id: Optional[str] = None
    chembl_target_id: Optional[str] = None
    organism: str = "Homo sapiens"
    pathway_ids: List[str] = []
    associated_diseases: List[Dict[str, Any]] = [] # [{"disease_id": "D01", "name": "Neuroinflammation", "evidence_count": 5}]

class Pathway(BaseModel):
    id: str
    name: str
    database: str = "Reactome / KEGG"
    external_id: Optional[str] = None
    description: Optional[str] = None
    target_ids: List[str] = []

class Disease(BaseModel):
    id: str
    name: str
    mesh_or_mondo_id: Optional[str] = None
    therapeutic_area: str
    associated_target_ids: List[str] = []

# ----------------- Polyherbal Formulation -----------------
class FormulationIngredient(BaseModel):
    plant_id: str
    scientific_name: str
    plant_part: str
    proportion: Optional[str] = None

class Formulation(BaseModel):
    id: str
    name: str
    traditional_system: str = "Ayurveda"
    reference_text: str
    traditional_indications: List[str] = []
    ingredients: List[FormulationIngredient] = []
    compound_count: Optional[int] = 0
    shared_compounds: List[str] = []

# ----------------- Literature & Mining -----------------
class LiteratureSnippet(BaseModel):
    id: str
    title: str
    authors: str
    journal: str
    publication_year: int
    pmid: Optional[str] = None
    doi: Optional[str] = None
    abstract: str
    extracted_entities: Dict[str, List[str]] = {} # {"plants": [], "compounds": [], "targets": [], "diseases": []}
    verification_status: str = "Pending Review" # "Pending Review", "Accepted", "Rejected"
    annotated_by: Optional[str] = None

class LiteratureReviewRequest(BaseModel):
    snippet_id: str
    action: str # "accept", "reject", "correct"
    corrected_entities: Optional[Dict[str, List[str]]] = None
    reviewer_notes: Optional[str] = None

# ----------------- Graph Models -----------------
class GraphNode(BaseModel):
    id: str
    label: str
    entity_type: str # "Plant", "PlantPart", "Compound", "Target", "Pathway", "Disease", "TraditionalUse"
    attributes: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: str
    is_inferred: bool = False
    evidence_id: Optional[str] = None
    evidence_grade: Optional[str] = "B"
    category: Optional[EvidenceCategory] = None

class KnowledgeGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Dict[str, int]

# ----------------- Evidence-to-Discovery Pathway -----------------
class PathwayStep(BaseModel):
    stage_index: int
    stage_name: str # e.g. "Traditional Use", "Medicinal Plant", "Plant Part", "Phytochemical", "Target", "Pathway", "Disease Evidence", "Research Hypothesis"
    entity_id: str
    entity_name: str
    entity_type: str
    metadata: Dict[str, Any] = {}

class PathwayEdge(BaseModel):
    source_stage: str
    target_stage: str
    relationship: str
    evidence: Optional[EvidenceRecord] = None
    is_experimental: bool = True
    uncertainty_level: str = "Low" # "Low", "Moderate", "High", "Missing"

class EvidenceToDiscoveryPathway(BaseModel):
    id: str
    title: str
    plant_id: str
    disease_id: str
    steps: List[PathwayStep]
    edges: List[PathwayEdge]
    overall_confidence: str # "High", "Medium", "Exploratory"
    limitations: List[str]
    missing_links: List[str] = []

# ----------------- Hypothesis Studio -----------------
class HypothesisFactor(BaseModel):
    factor_name: str
    score: float # 0.0 - 1.0
    weight: float
    contribution: float
    description: str

class ResearchHypothesis(BaseModel):
    id: str
    plant_id: str
    plant_name: str
    compound_id: str
    compound_name: str
    target_id: str
    target_name: str
    pathway_id: str
    pathway_name: str
    disease_id: str
    disease_name: str
    hypothesis_statement: str
    score: float # 0.0 - 100.0 (Explainable multi-factor score)
    score_grade: str # "A (Strong Basis)", "B (Promising)", "C (Exploratory)"
    factors: List[HypothesisFactor]
    supporting_evidence: List[EvidenceRecord]
    contradictory_evidence: List[EvidenceRecord] = []
    missing_connections: List[str] = []
    experimental_test_proposals: List[str]
    responsible_use_disclaimer: str

# ----------------- Research Dossier -----------------
class ResearchDossier(BaseModel):
    dossier_id: str
    generated_at: str
    research_question: str
    target_entity: Dict[str, Any]
    pathway: EvidenceToDiscoveryPathway
    hypothesis: ResearchHypothesis
    sources_and_licences: List[Dict[str, str]]
    limitations: List[str]
    disclaimer: str
