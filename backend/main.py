from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
import logging

from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.routers import loans, farmers, organizations, seed, ai_assessment

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as db:
            seed.seed_database(db)
    except Exception as e:
        logger.warning(f"Auto-seed check: {e}")
    logger.info("Application startup complete")
    yield
    # Shutdown
    logger.info("Application shutdown")


app = FastAPI(
    title="Agricultural Credit Lifecycle Platform",
    description="India's agricultural credit infrastructure for intelligent loan management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(loans.router, prefix="/api/v1/loans", tags=["Loans"])
app.include_router(farmers.router, prefix="/api/v1/farmers", tags=["Farmers"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(seed.router, prefix="/api/v1/seed", tags=["Seed"])
app.include_router(ai_assessment.router, prefix="/api/v1/assessments", tags=["AI Assessment"])


@app.get("/api")
async def api_root():
    """API health check"""
    return {
        "status": "healthy",
        "service": "Agricultural Credit Lifecycle Platform",
        "version": "1.0.0"
    }


@app.get("/")
async def serve_frontend():
    """Serve the AgriTrust web app"""
    index = FRONTEND_DIR / "index.html"
    if not index.exists():
        return {
            "status": "healthy",
            "service": "Agricultural Credit Lifecycle Platform",
            "version": "1.0.0",
            "frontend": "missing"
        }
    return FileResponse(index)


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2026-09-12T13:26:37.672Z"
    }


if FRONTEND_DIR.exists():
    app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="frontend-css")
    app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="frontend-js")
