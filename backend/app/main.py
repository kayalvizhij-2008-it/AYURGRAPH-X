from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Import API routes
from app.api.v1.routes.plants import router as plants_router
from app.api.v1.routes.compounds import router as compounds_router
from app.api.v1.routes.targets import router as targets_router
from app.api.v1.routes.pathways import router as pathways_router
from app.api.v1.routes.graph import router as graph_router
from app.api.v1.routes.literature import router as literature_router
from app.api.v1.routes.formulations import router as formulations_router
from app.api.v1.routes.biodiversity import router as biodiversity_router
from app.api.v1.routes.hypotheses import router as hypotheses_router
from app.api.v1.routes.evidence import router as evidence_router
from app.api.v1.routes.search import router as search_router
from app.api.v1.routes.dossier import router as dossier_router

from app.data.verified_dataset import (
    VERIFIED_PLANTS, VERIFIED_COMPOUNDS, VERIFIED_TARGETS,
    VERIFIED_PATHWAYS, VERIFIED_DISEASES, VERIFIED_EVIDENCE
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api/v1
app.include_router(plants_router, prefix=settings.API_V1_PREFIX)
app.include_router(compounds_router, prefix=settings.API_V1_PREFIX)
app.include_router(targets_router, prefix=settings.API_V1_PREFIX)
app.include_router(pathways_router, prefix=settings.API_V1_PREFIX)
app.include_router(graph_router, prefix=settings.API_V1_PREFIX)
app.include_router(literature_router, prefix=settings.API_V1_PREFIX)
app.include_router(formulations_router, prefix=settings.API_V1_PREFIX)
app.include_router(biodiversity_router, prefix=settings.API_V1_PREFIX)
app.include_router(hypotheses_router, prefix=settings.API_V1_PREFIX)
app.include_router(evidence_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(dossier_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Connecting Traditional Knowledge with Molecular Science",
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_PREFIX,
        "indexed_records": {
            "plants": len(VERIFIED_PLANTS),
            "compounds": len(VERIFIED_COMPOUNDS),
            "targets": len(VERIFIED_TARGETS),
            "pathways": len(VERIFIED_PATHWAYS),
            "diseases": len(VERIFIED_DISEASES),
            "evidence_records": len(VERIFIED_EVIDENCE)
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}
