# 🌿 AYURGRAPH-X: BioCultural Intelligence & Discovery Platform
> **Connecting Traditional Knowledge with Molecular Science.**  
> *Developed for the EthnoHack Data Hackathon on Ethnopharmacology and Health.*

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Scientific%20Discovery-0E281D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Visualization-Three.js-black?style=for-the-badge&logo=threedotjs" />
</p>

---

## 1. Executive Summary & Vision

**AYURGRAPH-X** is an explainable scientific intelligence platform that bridges centuries of traditional ethnobotanical knowledge with modern molecular pharmacology, high-throughput bioassays, and biodiversity conservation.

Traditional medical systems (such as Ayurveda, Siddha, and Unani) have documented complex botanical polyherbal preparations for millennia. However, this knowledge remains fragmented, siloed from molecular databases, and vulnerable to biopiracy or wild over-harvesting.

**AYURGRAPH-X introduces an auditable Evidence-to-Discovery Pathway:**
$$\text{Traditional Use} \to \text{Medicinal Plant} \to \text{Plant Part} \to \text{Phytochemical} \to \text{Biological Target} \to \text{Pathway} \to \text{Disease Evidence} \to \text{Research Hypothesis}$$

Every transitional connection provides traceable citations, experimental assay conditions (IC50, Ki, EC50), evidence category, confidence grading, and known contradictory findings (e.g. PAINS alerts, human bioavailability caveats).

---

## 2. Product Design & Visual Identity

AYURGRAPH-X is designed as a combination of:
- **A high-end scientific research instrument**
- **A botanical intelligence atlas**
- **A molecular discovery laboratory**
- **A modern data visualization platform**

### Palette & Typography:
- **Deep Botanical Forest Green:** `#0E281D` / `#153A2A`
- **Warm Ivory / Specimen Parchment:** `#FBF9F4` / `#F5F0E6` / `#EDE6D6`
- **Muted Herbarium Sage:** `#5D7A68` / `#8BA794`
- **Dark Charcoal:** `#151D19` / `#232D28`
- **Restrained Amber / Copper:** `#C8833E` / `#B45309`

### 3D Scientific Visual Architecture Across All Pages:
AYURGRAPH-X implements a consistent, immersive, high-performance 3D scientific visualization system across every module:
- **Homepage (`/`):** `CorollaGleam` 24-blade iridescent botanical gleam + `ParticleField` procedural spore system + `DepthCard` cursor-responsive 3D perspective cards.
- **Evidence-to-Discovery (`/pathway`):** `Pathway3D` 8-stage crystalline spline ribbon with orbital camera controls and synchronized stage pulse beads.
- **EthnoGraph (`/ethnograph`):** `ScientificGraph3D` Fibonacci spherical knowledge constellation with 3D/2D switcher and entity class filtering.
- **Knowledge Miner (`/miner`):** `LiteratureMiner3D` multi-faceted quartz prism refracting literature into 4 colored entity channels.
- **PhytoDiscover (`/phytodiscover`):** `FloatingMolecule` 3D CPK ball-and-stick rotatable molecular conformer.
- **FormulaLab (`/formulalab`):** `FormulaLab3D` polyherbal gemstone constellation with dynamic perturbation when ingredients are removed.
- **BioGuard (`/bioguard`):** `BioGlobe3D` dark terrestrial globe with spherical GBIF coordinates and species conservation halos.
- **TimeLens (`/timelens`):** `TimeLens3D` chronological helix with epoch rings spanning ~700 BCE to 2026 CE.
- **EvidenceTrust (`/evidencetrust`):** `EvidenceTrust3D` 6-tier stratified glass pyramid with energy beams and interactive click-to-filter.
- **Hypothesis Studio (`/hypotheses`):** `HypothesisRadar3D` morphing 3D faceted crystal reflecting 6-factor explainable scoring vectors.

---

## 3. The 8 Operational Research Modules

1. **Module 1 — EthnoGraph (`/ethnograph`):** Interactive Cytoscape.js knowledge graph connecting plants, synonyms, plant parts, traditional uses, phytochemicals, targets, pathways, and diseases with dynamic filtering and node inspection.
2. **Module 2 — Knowledge Miner (`/miner`):** Automated literature discovery and NLP rule-based entity extraction with a human-in-the-loop review interface (Accept, Reject, Correct).
3. **Module 3 — PhytoDiscover (`/phytodiscover`):** Phytochemical constituent explorer with 2D chemical structure depictions from PubChem, physicochemical properties (MW, LogP, TPSA), and experimental ChEMBL target bioactivity tables.
4. **Module 4 — FormulaLab (`/formulalab`):** Polyherbal formulation deconstruction (*Triphala*, *Trikatu*, *Ashwagandhadi Lehyam*), shared bioactive classes, and a **remove-one-ingredient impact matrix** simulating constituent loss upon single-herb perturbation.
5. **Module 5 — BioGuard (`/bioguard`):** Biodiversity intelligence tracking GBIF species occurrences, IUCN Red List threat assessments, cultivation-first research guidance, and **sensitive coordinate masking** to protect endangered wild germplasm.
6. **Module 6 — TimeLens (`/timelens`):** 3,000-year documentation chronology tracing knowledge from Vedic Charaka Samhita treaties to Linnaean taxonomy, Dunal monographic revisions, 1965 Withaferin A isolation, and 21st-century target genomics.
7. **Module 7 — EvidenceTrust (`/evidencetrust`):** Audit panel enforcing a 6-tier evidence grading system (Direct Experimental, Curated Database, Peer-Reviewed Literature, Computational Prediction, Machine Candidate, Unverified Hypothesis) and open data licence registry.
8. **Module 8 — Hypothesis Studio (`/hypotheses`):** Explainable multi-factor hypothesis ranking engine calculating contribution breakdowns across source quality, directness, identity confidence, and PAINS contradiction penalties, with 1-click **Downloadable Research Dossiers** (JSON and Printable format).

---

## 4. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Cytoscape.js, Three.js, Lucide Icons.
- **Backend:** Python 3.13, FastAPI, Pydantic, NetworkX Graph Engine, Uvicorn, HTTPX, Pytest.
- **Live Scientific Integrations:**
  - NCBI PubChem PUG REST API
  - EMBL-EBI ChEMBL 34 REST API
  - Global Biodiversity Information Facility (GBIF) API
  - NCBI PubMed E-utilities API
  - Kew Plants of the World Online (POWO) taxonomy

---

## 5. Quickstart & Local Execution

### Prerequisites:
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node v24)
- npm 9+

### Step 1: Start Backend API Service
```powershell
# Open terminal in project root
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --reload --port 8000
```
- Backend API will run at: **`http://127.0.0.1:8000`**
- Interactive Swagger OpenAPI Docs: **`http://127.0.0.1:8000/docs`**

### Step 2: Start Frontend Application
```powershell
# In a separate terminal
cd frontend
npm run dev
```
- Frontend application will run at: **`http://localhost:3000`**

### Step 3: Run Automated Test Suite
```powershell
# Run backend pytest suite
$env:PYTHONPATH="backend"
python -m pytest backend/tests -v
```
*(All 14 automated tests pass with 100% success rate across search, graph, dynamic multi-plant pathways, literature review loop, custom formulations, and dossier generation).*

See [FINAL_QA_REPORT.md](file:///C:/Users/dhurg/Desktop/AYURGRAPH-X/FINAL_QA_REPORT.md) for full audit documentation and [DEMO_GUIDE.md](file:///C:/Users/dhurg/Desktop/AYURGRAPH-X/DEMO_GUIDE.md) for the 5-minute hackathon demonstration script.

---

## 6. Ethics & Nagoya Protocol Compliance

AYURGRAPH-X is built upon explicit ethical principles:
1. **Traditional Knowledge Attribution:** Ancient Ayurvedic, Siddha, and indigenous formulations are recognized as biocultural heritage. The platform strictly disclaims intellectual property or patent claims over traditional practices.
2. **Anti-Biopiracy & Wild Harvest Safeguards:** Exact coordinates for threatened or vulnerable medicinal species are generalized to regional boundaries to prevent assisting illegal commercial gathering.
3. **Preclinical Research Boundary:** AYURGRAPH-X is a hypothesis-generation tool for laboratory scientists. It **NEVER** claims clinical efficacy, cures, or medical advice.

---

## 👩‍💻 Team

**Project:** AYURGRAPH-X  
**Institution:** Chennai Institute of Technology  
**Department:** Information Technology  

---

<p align="center">
  <strong>🌿 AYURGRAPH-X — Where Traditional Knowledge Meets Molecular Discovery.</strong>
</p>

<p align="center">
  Built with curiosity, scientific responsibility, and technology.
</p>

