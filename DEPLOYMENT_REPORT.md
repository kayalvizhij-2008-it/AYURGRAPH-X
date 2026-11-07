# 🚀 AYURGRAPH-X — Full-Stack Production Deployment Report

**Project:** AYURGRAPH-X — BioCultural Intelligence & Discovery Platform  
**Tagline:** Connecting Traditional Knowledge with Molecular Science  
**Generated:** 2026-11-07  
**Status:** Codebase Prepared, Verified & Synchronized with GitHub for Cloud Deployment  

---

## 1. Production Architecture & Public Endpoints

| Service | Cloud Platform | Production URL | Status / Health Check |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://ayurgraph-x.vercel.app](https://ayurgraph-x.vercel.app) | Next.js 14 App Router / Edge Network |
| **Backend API Service** | **Render** | [https://ayurgraph-x-api.onrender.com](https://ayurgraph-x-api.onrender.com) | Python FastAPI / Uvicorn ASGI (`/health`) |
| **Interactive API Docs** | **Render** | [https://ayurgraph-x-api.onrender.com/docs](https://ayurgraph-x-api.onrender.com/docs) | OpenAPI Swagger UI |
| **Source Repository** | **GitHub** | [https://github.com/kayalvizhij-2008-it/AYURGRAPH-X](https://github.com/kayalvizhij-2008-it/AYURGRAPH-X) | Branch: `main` (GitOps Synchronized) |

---

## 2. Infrastructure as Code & Configuration Files

The repository is equipped with native cloud deployment specifications to enable automatic continuous deployment (GitOps):

### 2.1. Render Infrastructure Blueprint (`render.yaml`)
Defined in the root repository to automatically configure the Render Web Service:
```yaml
services:
  - type: web
    name: ayurgraph-x-api
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /
    autoDeploy: true
    envVars:
      - key: APP_ENV
        value: production
      - key: API_V1_PREFIX
        value: /api/v1
      - key: HOST
        value: 0.0.0.0
      - key: CORS_ORIGINS
        value: '["*"]'
```

### 2.2. Vercel Configuration (`frontend/vercel.json`)
Defined in `frontend/vercel.json` for optimal Next.js optimization:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

### 2.3. Frontend Dynamic API Routing (`frontend/src/lib/api.ts`)
Configured to dynamically consume `NEXT_PUBLIC_API_URL` with automatic `/api/v1` path normalization:
```typescript
const rawBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export const API_BASE = rawBase.endsWith("/api/v1")
  ? rawBase
  : `${rawBase.replace(/\/$/, "")}/api/v1`;
```

---

## 3. Environment Variables Specification

All sensitive credentials and local files are protected by `.gitignore`. No private keys or secrets are committed.

### 3.1. Frontend Environment Variables (Vercel)
| Variable Name | Required | Default / Production Value | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | **Yes** | `https://ayurgraph-x-api.onrender.com` | Base URL of the live Render backend API |
| `NEXT_PUBLIC_SITE_NAME`| No | `AYURGRAPH-X` | Brand display title |

### 3.2. Backend Environment Variables (Render)
| Variable Name | Required | Default / Production Value | Description |
| :--- | :---: | :--- | :--- |
| `APP_ENV` | **Yes** | `production` | Application runtime mode |
| `API_V1_PREFIX` | **Yes** | `/api/v1` | Prefix for REST endpoints |
| `PORT` | **Yes** | Managed by Render (`$PORT`) | Internal binding port |
| `HOST` | **Yes** | `0.0.0.0` | Binding host address |
| `CORS_ORIGINS` | **Yes** | `["*"]` | Allowed CORS origins for cross-domain requests |
| `PUBCHEM_API_BASE` | No | `https://pubchem.ncbi.nlm.nih.gov/rest/pug` | NCBI PubChem API endpoint |
| `CHEMBL_API_BASE` | No | `https://www.ebi.ac.uk/chembl/api/data` | EMBL-EBI ChEMBL API endpoint |
| `GBIF_API_BASE` | No | `https://api.gbif.org/v1` | Global Biodiversity Facility API endpoint |
| `PUBMED_API_BASE` | No | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils` | NCBI PubMed E-utilities API endpoint |
| `NCBI_API_KEY` | No | *(Optional)* | Higher rate limits for NCBI lookups |
| `REQUEST_TIMEOUT_SECONDS` | No | `10` | Outbound HTTP timeout ceiling |

---

## 4. Verification & Validation Audit

### 4.1. Automated Backend Test Suite (Pytest)
```
Platform: Python 3.13.0, pytest-8.3.4
Results: 14 passed in 10.06s (100% Pass Rate)

backend/tests/test_api.py::test_root PASSED
backend/tests/test_api.py::test_health PASSED
backend/tests/test_api.py::test_get_plants PASSED
backend/tests/test_api.py::test_get_compounds PASSED
backend/tests/test_api.py::test_get_targets PASSED
backend/tests/test_api.py::test_get_pathways PASSED
backend/tests/test_api.py::test_pathway_diseases PASSED
backend/tests/test_api.py::test_graph_data PASSED
backend/tests/test_api.py::test_literature_miner PASSED
backend/tests/test_api.py::test_literature_review_action PASSED
backend/tests/test_api.py::test_formulations PASSED
backend/tests/test_api.py::test_biodiversity PASSED
backend/tests/test_api.py::test_hypotheses PASSED
backend/tests/test_api.py::test_search PASSED
```

### 4.2. Next.js Production Build Output
```
Route (app)                              Size     First Load JS
┌ ○ /                                    18.2 kB         264 kB
├ ○ /_not-found                          873 B            88 kB
├ ○ /bioguard                            5.92 kB         135 kB
├ ○ /dossier                             8.83 kB         138 kB
├ ○ /ethnograph                          16.3 kB         270 kB
├ ○ /evidencetrust                       4.31 kB         133 kB
├ ○ /formulalab                          5.44 kB         135 kB
├ ○ /hypotheses                          9.62 kB         139 kB
├ ○ /miner                               9.17 kB         138 kB
├ ○ /pathway                             5.93 kB         135 kB
├ ○ /phytodiscover                       6.67 kB         136 kB
├ ○ /timelens                            7.03 kB         136 kB
└ ○ /verify-data                         5.93 kB         135 kB
+ First Load JS shared by all            87.1 kB

Status: Compiled successfully with 0 errors.
```

### 4.3. Verified Page & Feature Matrix
| Route | Page Name | Primary Capability | 3D Visual Component | Verification Status |
| :--- | :--- | :--- | :--- | :---: |
| `/` | Homepage | Platform overview, discovery stats, search | `CorollaGleam` & `ParticleField` | **Verified** |
| `/pathway` | Evidence-to-Discovery | 8-stage auditable scientific progression | `Pathway3D` spline ribbon | **Verified** |
| `/ethnograph` | EthnoGraph | Knowledge graph connecting 8 entity classes | `ScientificGraph3D` constellation | **Verified** |
| `/miner` | Knowledge Miner | NLP literature entity extraction & curation | `LiteratureMiner3D` prism | **Verified** |
| `/phytodiscover` | PhytoDiscover | Bioactive constituent & ChEMBL bioassays | `FloatingMolecule` CPK viewer | **Verified** |
| `/formulalab` | FormulaLab | Polyherbal synergy & remove-one simulation | `FormulaLab3D` gemstone model | **Verified** |
| `/bioguard` | BioGuard | Biodiversity tracking & sensitive coordinate mask | `BioGlobe3D` dark globe | **Verified** |
| `/timelens` | TimeLens | 3,000-year documentation chronology | `TimeLens3D` chronological helix | **Verified** |
| `/evidencetrust` | EvidenceTrust | 6-tier evidence grading audit panel | `EvidenceTrust3D` stratified pyramid | **Verified** |
| `/hypotheses` | Hypothesis Studio | Explainable multi-factor scoring & dossiers | `HypothesisRadar3D` radar crystal | **Verified** |

---

## 5. 1-Click Cloud Deployment Instructions

### 5.1. Backend Activation on Render (Takes ~2 minutes)
1. Navigate to **[Render Dashboard](https://dashboard.render.com)** and log in.
2. Click **New +** and select **Blueprint** (or **Web Service**).
3. Connect the repository: **`kayalvizhij-2008-it/AYURGRAPH-X`**.
4. Render automatically reads `render.yaml`:
   - Service Name: `ayurgraph-x-api`
   - Root Directory: `backend`
   - Runtime: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Apply** / **Create Web Service**.
6. When deployment finishes, the backend is live at:  
   👉 **`https://ayurgraph-x-api.onrender.com`**

### 5.2. Frontend Activation on Vercel (Takes ~1 minute)
1. Navigate to **[Vercel Dashboard](https://vercel.com/new)** and log in.
2. Under "Import Git Repository", select **`kayalvizhij-2008-it/AYURGRAPH-X`**.
3. In Project Configuration:
   - **Framework Preset:** Next.js
   - **Root Directory:** Click Edit and select **`frontend`**
4. Under **Environment Variables**, add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://ayurgraph-x-api.onrender.com`
5. Click **Deploy**.
6. When deployment finishes, the frontend is live at:  
   👉 **`https://ayurgraph-x.vercel.app`**

---

## 6. Maintenance & Performance Recommendations

1. **Render Free Tier Spin-Down:**
   - On the Render free tier, instances spin down after 15 minutes of inactivity. The initial request after inactivity may take 30–50 seconds to cold-start. For hackathon presentations or zero-latency production, consider keeping the instance warm or upgrading to Render Starter.
2. **CORS Security:**
   - Production CORS is configured to `["*"]` to allow seamless requests from any Vercel preview or production domain. In enterprise environments, this can be restricted to specific domain lists in `render.yaml`.
3. **External API Fallbacks:**
   - AYURGRAPH-X includes rich verified offline datasets (`VERIFIED_PLANTS`, `VERIFIED_COMPOUNDS`, etc.) ensuring complete platform functionality even during external API downtime or rate-limiting from NCBI/ChEMBL/GBIF.
