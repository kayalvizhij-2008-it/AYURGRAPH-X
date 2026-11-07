# AYURGRAPH-X: Project Plan & Implementation Roadmap

## 1. Executive Summary
**Product Name:** AYURGRAPH-X  
**Full Title:** BioCultural Intelligence & Discovery Platform  
**Tagline:** Connecting Traditional Knowledge with Molecular Science  
**Target Event:** EthnoHack Data Hackathon on Ethnopharmacology and Health  

AYURGRAPH-X is an explainable scientific intelligence platform connecting traditional medicinal knowledge, botanical taxonomy, phytochemical constituents, biological targets, pathway mechanisms, and disease-related evidence with biodiversity conservation data.

---

## 2. Core Pillars & Value Proposition
1. **Evidence-to-Discovery Pathway:**
   $$\text{Traditional Use} \to \text{Medicinal Plant} \to \text{Plant Part} \to \text{Phytochemical} \to \text{Biological Target} \to \text{Pathway} \to \text{Disease Evidence} \to \text{Research Hypothesis}$$
2. **Transparent Provenance & Uncertainty:** Every link indicates whether it is direct experimental, curated database, literature-derived, computational prediction, or machine-extracted candidate.
3. **Responsible Traditional Knowledge Ethics:** Adherence to Nagoya Protocol principles, community attribution, protection of vulnerable species coordinates, and strict research hypothesis boundaries (no clinical treatment claims).
4. **Distinctive Botanical & Lab Visual Identity:** Forest green, warm ivory parchment, muted sage, restrained amber/copper, and the signature `CorollaGleam` iridescent botanical component.

---

## 3. Module Inventory & Milestones

| Module | Core Purpose | Key Technologies |
|---|---|---|
| **Module 1: EthnoGraph** | Unified multi-relational knowledge graph explorer | Cytoscape.js, NetworkX, FastAPI |
| **Module 2: Knowledge Miner** | NLP literature extraction & verification loop | PubMed E-utilities, Rule/Regex NER, Human-in-the-loop review |
| **Module 3: PhytoDiscover** | Phytochemical molecular explorer & target bioactivity | PubChem PUG REST, ChEMBL API, 2D Structure Rendering |
| **Module 4: FormulaLab** | Polyherbal formulation constituent analysis & remove-one matrix | Combinatorial Venn/Overlaps, Synergy disclaimer engine |
| **Module 5: BioGuard** | Biodiversity, GBIF distribution, POWO taxonomy & IUCN conservation | MapLibre GL, GBIF Occurrences API, Species Protection filter |
| **Module 6: TimeLens** | Historical texts vs modern literature documentation timeline | Timeline visualization, Botanical synonym evolution |
| **Module 7: EvidenceTrust** | Audit panel for scientific grades, contradictions, and data licenses | 6-tier evidence grading, Provenance inspector |
| **Module 8: Hypothesis Studio** | Multi-factor hypothesis generator and research dossier exporter | Explainable scoring algorithm, PDF/JSON export |
| **Signature Feature** | Interactive Evidence-to-Discovery Pathway Explorer | Step-by-step interactive breadcrumb/stepper with evidence inspection |

---

## 4. Implementation Phases

- **Phase 1: Inspection & Environment Setup (Completed):** Verified Node.js v24, Python 3.13, workspace directory.
- **Phase 2: Architecture & Documentation (Current):** Authoring `PROJECT_PLAN.md`, `ARCHITECTURE.md`, `DATA_SOURCES_AND_LICENCES.md`, `IMPLEMENTATION_STATUS.md`.
- **Phase 3: Backend Foundation & Data Models:** FastAPI application, Pydantic schemas, SQLite persistence, verified core dataset (Ashwagandha, Turmeric, Neem, Tulsi, Ginger, Triphala, Trikatu).
- **Phase 4: Scientific Data Adapters & Engines:** PubChem, ChEMBL, GBIF, PubMed, NetworkX graph engine, hypothesis ranking engine.
- **Phase 5: Frontend Application & Design System:** Next.js, Tailwind CSS with custom botanical palette, CorollaGleam WebGL/Canvas visual, persistent navigation.
- **Phase 6: Module Realization:** Implementing all 8 modules + Signature Evidence-to-Discovery Pathway.
- **Phase 7: Testing & Verification:** Backend test suite, frontend build & typecheck, API integration checks.
- **Phase 8: Polish, Dossier Export & Hackathon Demo Guide:** JSON & Printable Research Dossier, DEMO_GUIDE.md, README.md.
