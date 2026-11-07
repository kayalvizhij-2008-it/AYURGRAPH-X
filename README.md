# 🌿 AYURGRAPH-X
### BioCultural Intelligence & Discovery Platform
**Connecting Traditional Knowledge with Molecular Science.**

<p align="center">
  <strong>Bridging Ethnopharmacology, Phytochemistry, Molecular Biology & Biodiversity Intelligence.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Scientific%20Discovery-0E281D?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Visualization-Three.js-black?style=for-the-badge&logo=threedotjs" />
</p>

---

## 🌱 Overview

**AYURGRAPH-X** is a scientific intelligence platform designed to connect traditional medicinal knowledge with modern molecular research.

Traditional medical systems contain centuries of documented knowledge about medicinal plants and their applications. However, connecting these records with phytochemical composition, experimentally studied biological targets, molecular pathways, scientific publications, and biodiversity information remains a complex research challenge.

AYURGRAPH-X addresses this challenge through an evidence-aware discovery environment that transforms disconnected scientific and ethnobotanical information into traceable research connections.

Rather than presenting traditional uses as proven medical outcomes, the platform helps researchers explore transparent, testable hypotheses while identifying evidence gaps, contradictory findings, and limitations.

> **Our vision:** Transform fragmented traditional knowledge and molecular research into a connected, explainable, and responsible scientific discovery ecosystem.

## ✨ What Makes AYURGRAPH-X Different?

- **Evidence-to-Discovery Pathways:** Explore connections from traditional medicinal use to research hypotheses.
- **BioCultural Knowledge Graph:** Visualize relationships between medicinal plants, phytochemicals, targets, pathways, and diseases.
- **Scientific Provenance:** Trace research connections back to their supporting sources.
- **Explainable Discovery:** Understand why a research hypothesis receives its ranking.
- **Biodiversity Intelligence:** Integrate species and conservation information while protecting sensitive locations.
- **Responsible Research:** Make uncertainty, contradictions, licensing, and missing evidence visible.

## 🔬 Core Research Modules

| Module | Purpose |
|---|---|
| EthnoGraph | Interactive knowledge graph for botanical and molecular relationships |
| Knowledge Miner | Scientific literature discovery and candidate relationship extraction |
| PhytoDiscover | Phytochemical exploration and molecular bioactivity research |
| FormulaLab | Polyherbal formulation and ingredient relationship analysis |
| BioGuard | Biodiversity, species occurrence, and conservation intelligence |
| TimeLens | Historical chronology of ethnobotanical and scientific knowledge |
| EvidenceTrust | Evidence grading, source provenance, and licence transparency |
| Hypothesis Studio | Explainable ranking and research dossier generation |

## 🧬 Signature Feature: Evidence-to-Discovery Pathway

AYURGRAPH-X introduces an eight-stage research exploration pathway:

```text
Traditional Medicinal Use
          ↓
     Medicinal Plant
          ↓
       Plant Part
          ↓
     Phytochemical
          ↓
   Biological Target
          ↓
       Pathway
          ↓
 Disease-related Evidence
          ↓
  Research Hypothesis
```

Every connection is designed to expose available evidence, supporting sources, evidence categories, directness, experimental or computational origin, and limitations.

**A missing scientific connection is displayed as missing—not invented.**

## 🧪 Scientific Intelligence & Data Sources

The platform is designed to work with established scientific resources:

| Resource | Research Application |
|---|---|
| [PubChem](https://pubchem.ncbi.nlm.nih.gov/) | Chemical structures and molecular properties |
| [ChEMBL](https://www.ebi.ac.uk/chembl/) | Experimental bioactivity and target information |
| [PubMed](https://pubmed.ncbi.nlm.nih.gov/) | Biomedical literature discovery |
| [GBIF](https://www.gbif.org/) | Biodiversity and species occurrence |
| [Kew POWO](https://powo.science.kew.org/) | Botanical taxonomy and plant names |
| [Open Targets](https://platform.opentargets.org/) | Target–disease research associations |
| [IMPPAT](https://cb.imsc.res.in/imppat/) | Indian medicinal plants, phytochemicals, and therapeutic associations |

*Data availability, integration status, source attribution, and licence restrictions must be verified individually. Not every listed resource necessarily provides a live integration in every deployment.*

## 🏗️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- Cytoscape.js
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- NetworkX
- HTTPX

### Scientific Data & Visualization
- PubChem PUG REST
- ChEMBL API
- PubMed E-utilities
- GBIF API
- Interactive molecular and network visualizations

## 🎨 Design Philosophy

AYURGRAPH-X combines botanical inspiration with modern scientific technology.

**Visual identity:**
- Deep Botanical Forest Green — `#0E281D`
- Warm Ivory Parchment — `#FBF9F4`
- Herbarium Sage — `#5D7A68`
- Dark Charcoal — `#151D19`
- Restrained Amber/Copper — `#C8833E`

The interface incorporates immersive 3D botanical elements, molecular-inspired visuals, interactive research graphs, subtle animations, and responsive layouts.

## ⚙️ Getting Started

### Prerequisites

Install:

- Node.js and npm
- Python 3.10+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/AYURGRAPH-X.git
cd AYURGRAPH-X
```

### 2. Set up the backend

From the project root:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

Start the backend:

```powershell
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --reload --port 8000
```

Backend:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:3000`

### 4. Run backend tests

From the project root:

```powershell
$env:PYTHONPATH="backend"
python -m pytest backend/tests
```

## 📁 Project Structure

```text
AYURGRAPH-X/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── services/
│   │   └── routes/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   └── package.json
│
├── PROJECT_PLAN.md
├── ARCHITECTURE.md
├── DATA_SOURCES_AND_LICENCES.md
├── IMPLEMENTATION_STATUS.md
├── DEMO_GUIDE.md
└── README.md
```

*The structure above is an architectural overview; actual directories may differ as the implementation evolves.*

## 🛡️ Responsible Science & Ethics

AYURGRAPH-X is designed as a research-support platform, not a medical diagnosis or treatment system.

Our principles:

- No unsupported claims of clinical effectiveness.
- No fabricated scientific citations or biological relationships.
- Clear distinction between experimental findings and computational predictions.
- Transparent source attribution and data licensing.
- Respect for traditional knowledge ownership and community attribution.
- Protection of sensitive biodiversity coordinates.
- Responsible consideration of the Nagoya Protocol and access-and-benefit-sharing principles.

**Traditional use is a starting point for scientific investigation, not proof of clinical efficacy.**

## 🚀 Future Scope

- Expanded ethnobotanical knowledge graph.
- More verified scientific database integrations.
- Advanced literature entity extraction with researcher review.
- Improved molecular relationship analysis.
- Geographic biodiversity intelligence.
- Multilingual traditional knowledge exploration.
- Research collaboration and annotation tools.
- Advanced evidence-quality evaluation.

## 🏆 Hackathon Project

Developed for **EthnoHack – Data Hackathon on Ethnopharmacology and Health**.

AYURGRAPH-X explores how data science, molecular research, and responsible technology can help bridge traditional medicinal knowledge with contemporary scientific discovery.

## 👩‍💻 Team

**Project:** AYURGRAPH-X  
**Institution:** Chennai Institute of Technology  
**Department:** Information Technology

## 📜 Disclaimer

AYURGRAPH-X is intended exclusively for scientific research, educational exploration, and hypothesis generation. Its outputs do not constitute medical advice, diagnosis, treatment recommendations, or evidence of clinical efficacy. Users must independently verify source data, scientific claims, and licensing conditions.

---

<p align="center">
  <strong>🌿 AYURGRAPH-X — Where Traditional Knowledge Meets Molecular Discovery.</strong>
</p>

<p align="center">
  Built with curiosity, scientific responsibility, and technology.
</p>
