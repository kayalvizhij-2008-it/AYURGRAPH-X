# AYURGRAPH-X: System Architecture & Data Flow

## 1. Architectural Overview

```
+-----------------------------------------------------------------------------------+
|                                  AYURGRAPH-X UI                                   |
|                Next.js (App Router) + React 18/19 + TypeScript + Tailwind         |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |   Landing Page     |  |  Interactive Modules |  | Signature Pathway Explorer|  |
|  | (CorollaGleam WebGL|  |  (EthnoGraph, Bio-   |  | (Traditional Use -> Target|  |
|  |  + Research Intro) |  |   Guard, Phyto, etc) |  |  -> Pathway -> Hypothesis)|  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |  Cytoscape.js Viz  |  |  MapLibre GL Maps    |  | Research Dossier Exporter |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+-----------------------------------------|-----------------------------------------+
                                          | REST JSON API (v1)
                                          v
+-----------------------------------------------------------------------------------+
|                             BACKEND API SERVICE (FastAPI)                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                                API ROUTERS                                  |  |
|  |  /api/v1/search        /api/v1/plants         /api/v1/compounds             |  |
|  |  /api/v1/targets       /api/v1/pathways       /api/v1/graph                 |  |
|  |  /api/v1/literature    /api/v1/formulations   /api/v1/biodiversity          |  |
|  |  /api/v1/hypotheses    /api/v1/evidence       /api/v1/dossier               |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------+  |  +-----------------------------------+  |
|  |          CORE ENGINES             |  |  |       EXTERNAL DATA ADAPTERS      |  |
|  | - NetworkX Graph Engine           |  |  | - PubChem PUG REST Adapter        |  |
|  | - Hypothesis Ranking Engine       |  |  | - ChEMBL Bioactivity Adapter      |  |
|  | - Literature NER / Review Engine  |  |  | - GBIF Biodiversity API Adapter   |  |
|  | - Formula Synergy Analysis Engine |  |  | - PubMed E-utilities Adapter      |  |
|  | - Evidence Provenance Auditor     |  |  | (With resilient cache & fallback)|  |
|  +-----------------------------------+  |  +-----------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                    DATA STORE & NORMALIZED RECORD LAYER                     |  |
|  | - SQLite Normalized Store (Plants, Compounds, Targets, Evidence, Literature)|  |
|  | - Verified Ethnopharmacology Graph Dataset                                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

## 2. Evidence Classification System
Every edge in AYURGRAPH-X is tagged with an immutable provenance record:
1. **Tier 1: Direct Experimental Evidence** (In vitro, in vivo, crystallographic binding from ChEMBL/PubChem BioAssay).
2. **Tier 2: Curated Database Evidence** (IMPPAT 3.0, LOTUS, NPASS, ChEMBL curated target mappings).
3. **Tier 3: Peer-Reviewed Literature Association** (PubMed indexed clinical or mechanistic studies with PMIDs).
4. **Tier 4: Computational Prediction** (Target prediction, molecular docking, QSAR score).
5. **Tier 5: Machine-Extracted Candidate Relationship** (NLP-extracted from abstracts, awaiting human verification).
6. **Tier 6: Unverified Hypothesis** (Algorithmically generated research proposal).

## 3. Data Integrity & Caching Strategy
- Three-state data origin tracking: `LIVE`, `CACHED`, `VERIFIED_SAMPLE`.
- Transparent confidence and uncertainty indicators on all API responses.
- Strict isolation of protected biodiversity coordinates (fuzzed/county-level representation for vulnerable taxa).
