"""
AgriTrust AI Assessment Engine
--------------------------------
Simulates real-time data collection from:
  • AGMARKNET  — wholesale market prices
  • Weather API — rainfall & climate risk
  • PMFBY      — crop insurance risk index
  • ICAR DL    — disease outbreak probability

Then runs a deterministic credit-scoring model to produce a
fully-documented Loan Assessment Report for the bank.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import math
import logging

from backend.database import get_db
from backend.models import Farmer, Loan, LoanStatus, LoanAssessment
from backend.schemas import AssessmentRequest, AssessmentResponse, FarmerAcceptPayload

router = APIRouter()
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Crop knowledge base (realistic Indian agri data)
# ---------------------------------------------------------------------------
CROP_KB = {
    "sugarcane": {
        "yield_per_acre": 35.0,        # quintals per acre
        "market_price": 3150.0,        # ₹ per quintal (AGMARKNET avg)
        "cultivation_cost_per_acre": 22000.0,
        "disease_risk_base": 28.0,     # % probability base
        "water_demand": "high",
        "season": "Kharif/Rabi",
    },
    "wheat": {
        "yield_per_acre": 20.0,
        "market_price": 2275.0,
        "cultivation_cost_per_acre": 14000.0,
        "disease_risk_base": 18.0,
        "water_demand": "medium",
        "season": "Rabi",
    },
    "rice": {
        "yield_per_acre": 22.0,
        "market_price": 2183.0,
        "cultivation_cost_per_acre": 16000.0,
        "disease_risk_base": 32.0,
        "water_demand": "high",
        "season": "Kharif",
    },
    "paddy": {
        "yield_per_acre": 22.0,
        "market_price": 2183.0,
        "cultivation_cost_per_acre": 16000.0,
        "disease_risk_base": 30.0,
        "water_demand": "high",
        "season": "Kharif",
    },
    "cotton": {
        "yield_per_acre": 8.0,
        "market_price": 6500.0,
        "cultivation_cost_per_acre": 20000.0,
        "disease_risk_base": 35.0,
        "water_demand": "medium",
        "season": "Kharif",
    },
    "groundnut": {
        "yield_per_acre": 12.0,
        "market_price": 5000.0,
        "cultivation_cost_per_acre": 18000.0,
        "disease_risk_base": 20.0,
        "water_demand": "low",
        "season": "Kharif",
    },
    "default": {
        "yield_per_acre": 18.0,
        "market_price": 2500.0,
        "cultivation_cost_per_acre": 15000.0,
        "disease_risk_base": 25.0,
        "water_demand": "medium",
        "season": "Kharif",
    },
}

def _crop_key(crop_type: str) -> str:
    """Normalise crop string to knowledge-base key."""
    ct = crop_type.lower().strip()
    for key in CROP_KB:
        if key in ct:
            return key
    return "default"


# ---------------------------------------------------------------------------
# Simulated external-data collectors
# ---------------------------------------------------------------------------

def _fetch_agmarknet(crop_type: str, farmer_id: int) -> dict:
    """Simulate AGMARKNET wholesale price fetch."""
    key = _crop_key(crop_type)
    base = CROP_KB[key]["market_price"]
    # Introduce realistic variation keyed on farmer_id for repeatability
    variation = ((farmer_id * 17 + 31) % 21 - 10) / 100   # ±10%
    price = round(base * (1 + variation), 2)
    return {
        "source": "AGMARKNET",
        "crop": crop_type,
        "market_price_per_quintal": price,
        "market": "APMC Wholesale",
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
    }


def _fetch_weather(farmer_id: int) -> dict:
    """Simulate weather/rainfall API (IMD / Open-Meteo)."""
    # Deterministic variation per farmer for demo repeatability
    base_rainfall = 820.0  # mm annual avg for central India
    variation = ((farmer_id * 13 + 7) % 41 - 20) / 100
    rainfall = round(base_rainfall * (1 + variation), 1)

    # Risk: low rainfall or excess both increase risk
    if rainfall < 600:
        risk = 72.0 + (600 - rainfall) / 10
    elif rainfall > 1200:
        risk = 65.0 + (rainfall - 1200) / 20
    else:
        risk = max(15.0, 45.0 - (rainfall - 600) / 30)

    return {
        "source": "Weather/IMD",
        "rainfall_mm": rainfall,
        "weather_risk_score": round(min(risk, 95.0), 1),
    }


def _fetch_pmfby(crop_type: str, farmer_id: int) -> dict:
    """Simulate PMFBY (crop insurance) risk index."""
    key = _crop_key(crop_type)
    base = CROP_KB[key]["disease_risk_base"] * 0.8
    variation = ((farmer_id * 11 + 3) % 31 - 15) / 100
    risk = round(base * (1 + variation), 1)
    return {
        "source": "PMFBY",
        "insurance_risk_score": max(5.0, min(risk, 80.0)),
    }


def _fetch_icar_disease(crop_type: str, farmer_id: int) -> dict:
    """Simulate ICAR crop-disease deep-learning model output."""
    key = _crop_key(crop_type)
    base = CROP_KB[key]["disease_risk_base"]
    variation = ((farmer_id * 19 + 41) % 37 - 18) / 100
    risk = round(base * (1 + variation), 1)
    return {
        "source": "ICAR Disease DL",
        "disease_risk_score": max(5.0, min(risk, 85.0)),
    }


# ---------------------------------------------------------------------------
# Credit-scoring engine
# ---------------------------------------------------------------------------

def _credit_score(
    loan_amount: float,
    projected_profit: float,
    projected_loss: float,
    weather_risk: float,
    disease_risk: float,
    insurance_risk: float,
    prior_loan_count: int,
    prior_defaults: int,
) -> tuple[int, str, str]:
    """
    Returns (credit_score 300-900, recommendation, ai_notes).
    """
    score = 700  # start neutral

    # Profitability factor
    if projected_profit > 0:
        profit_ratio = projected_profit / loan_amount
        score += min(80, int(profit_ratio * 200))
    else:
        score -= 60

    # Risk deductions
    avg_risk = (weather_risk + disease_risk + insurance_risk) / 3.0
    score -= int(avg_risk * 0.8)

    # Repayment history
    if prior_loan_count > 0:
        if prior_defaults == 0:
            score += 50
        else:
            default_rate = prior_defaults / prior_loan_count
            score -= int(default_rate * 150)

    # Loss buffer
    net = projected_profit - projected_loss
    if net < 0:
        score -= min(80, int(abs(net) / loan_amount * 100))

    score = max(300, min(900, score))

    if score >= 720:
        recommendation = "Approve"
        notes = (
            f"Strong credit profile. Projected profit ₹{projected_profit:,.0f} "
            f"comfortably covers loan of ₹{loan_amount:,.0f}. "
            f"Average risk index {avg_risk:.1f}% is within acceptable limits. "
            f"Tamil Nadu interest subsidy applicable on timely repayment."
        )
    elif score >= 580:
        recommendation = "Review"
        notes = (
            f"Moderate credit profile. Projected profit ₹{projected_profit:,.0f} "
            f"covers loan but risk factors require closer monitoring. "
            f"Average risk index {avg_risk:.1f}%. "
            f"Recommend attaching PMFBY insurance cover as condition."
        )
    else:
        recommendation = "Reject"
        notes = (
            f"High-risk profile. Average risk index {avg_risk:.1f}% is elevated. "
            f"Projected loss ₹{projected_loss:,.0f} may exceed repayment capacity. "
            f"Loan not recommended without additional collateral or guarantor."
        )

    return score, recommendation, notes


# ---------------------------------------------------------------------------
# Main assessment orchestrator
# ---------------------------------------------------------------------------

def run_ai_assessment(
    farmer_id: int,
    loan_amount: float,
    crop_type: str,
    land_size_acres: float,
    prior_loans: list,
) -> dict:
    """
    Orchestrates all data fetches and returns a complete assessment dict.
    """
    key = _crop_key(crop_type)
    kb = CROP_KB[key]

    # 1. Collect real-time data
    agmarknet = _fetch_agmarknet(crop_type, farmer_id)
    weather = _fetch_weather(farmer_id)
    pmfby = _fetch_pmfby(crop_type, farmer_id)
    icar = _fetch_icar_disease(crop_type, farmer_id)

    market_price = agmarknet["market_price_per_quintal"]
    rainfall_mm = weather["rainfall_mm"]
    weather_risk = weather["weather_risk_score"]
    insurance_risk = pmfby["insurance_risk_score"]
    disease_risk = icar["disease_risk_score"]

    # 2. Yield & financial projections
    # Adjust yield by rainfall (optimal ~800mm)
    rainfall_factor = 1.0 - abs(rainfall_mm - 800) / 3000
    rainfall_factor = max(0.55, min(1.1, rainfall_factor))
    disease_factor = 1.0 - (disease_risk / 100) * 0.4
    estimated_yield = round(kb["yield_per_acre"] * land_size_acres * rainfall_factor * disease_factor, 2)

    projected_revenue = round(estimated_yield * market_price, 2)
    total_cost = round(kb["cultivation_cost_per_acre"] * land_size_acres + loan_amount * 0.07, 2)
    projected_profit = round(max(0.0, projected_revenue - total_cost), 2)

    # Worst-case loss scenario (full crop failure)
    worst_yield = estimated_yield * 0.3
    worst_revenue = round(worst_yield * market_price * 0.8, 2)
    projected_loss = round(max(0.0, total_cost - worst_revenue), 2)

    # Seasonal risk
    avg_risk = (weather_risk + disease_risk + insurance_risk) / 3.0
    if avg_risk < 25:
        seasonal_risk = "Low"
    elif avg_risk < 50:
        seasonal_risk = "Medium"
    else:
        seasonal_risk = "High"

    # 3. Credit scoring
    prior_defaults = sum(1 for l in prior_loans if l.status == LoanStatus.DEFAULTED)
    credit_score, recommendation, ai_notes = _credit_score(
        loan_amount=loan_amount,
        projected_profit=projected_profit,
        projected_loss=projected_loss,
        weather_risk=weather_risk,
        disease_risk=disease_risk,
        insurance_risk=insurance_risk,
        prior_loan_count=len(prior_loans),
        prior_defaults=prior_defaults,
    )

    return {
        "market_price_per_quintal": market_price,
        "rainfall_mm": rainfall_mm,
        "weather_risk_score": weather_risk,
        "insurance_risk_score": insurance_risk,
        "disease_risk_score": disease_risk,
        "estimated_yield_quintals": estimated_yield,
        "projected_revenue": projected_revenue,
        "projected_profit": projected_profit,
        "projected_loss": projected_loss,
        "seasonal_risk": seasonal_risk,
        "credit_score": credit_score,
        "recommendation": recommendation,
        "ai_notes": ai_notes,
        "document_generated": True,
    }


# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(req: AssessmentRequest, db: Session = Depends(get_db)):
    """
    Step 2–4: Bank Admin triggers AI assessment for a farmer.
    Collects live data, runs credit engine, saves assessment + generates document.
    """
    farmer = db.query(Farmer).filter(Farmer.id == req.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    prior_loans = db.query(Loan).filter(Loan.farmer_id == req.farmer_id).all()

    logger.info(f"Running AI assessment for farmer {req.farmer_id}, crop={req.crop_type}, amount={req.loan_amount}")

    result = run_ai_assessment(
        farmer_id=req.farmer_id,
        loan_amount=req.loan_amount,
        crop_type=req.crop_type,
        land_size_acres=req.land_size_acres,
        prior_loans=prior_loans,
    )

    assessment = LoanAssessment(
        farmer_id=req.farmer_id,
        loan_amount=req.loan_amount,
        crop_type=req.crop_type,
        land_size_acres=req.land_size_acres,
        **result,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    logger.info(f"Assessment #{assessment.id} created: score={assessment.credit_score}, rec={assessment.recommendation}")
    return assessment


@router.get("/farmer/{farmer_id}", response_model=list[AssessmentResponse])
def get_farmer_assessments(farmer_id: int, db: Session = Depends(get_db)):
    """Get all assessments for a farmer."""
    return db.query(LoanAssessment).filter(LoanAssessment.farmer_id == farmer_id).order_by(LoanAssessment.id.desc()).all()


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get a single assessment by ID."""
    a = db.query(LoanAssessment).filter(LoanAssessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return a


@router.post("/{assessment_id}/accept", response_model=AssessmentResponse)
def farmer_accept(assessment_id: int, db: Session = Depends(get_db)):
    """
    Step 6–7: Farmer accepts the loan assessment document.
    If AI recommendation is Approve, the Agentic AI automatically
    creates a Loan record with status=approved and links it.
    """
    a = db.query(LoanAssessment).filter(LoanAssessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if a.farmer_accepted:
        raise HTTPException(status_code=400, detail="Assessment already accepted")
    if not a.document_generated:
        raise HTTPException(status_code=400, detail="Document not yet generated")

    a.farmer_accepted = True
    a.farmer_accepted_at = datetime.utcnow()

    # Agentic AI: auto-approve if recommendation is Approve
    if a.recommendation == "Approve":
        loan = Loan(
            farmer_id=a.farmer_id,
            amount=a.loan_amount,
            interest_rate=7.0,   # Tamil Nadu KCC standard rate
            duration_months=12,
            purpose=f"AI-Approved: {a.crop_type} cultivation ({a.land_size_acres} acres)",
            status=LoanStatus.APPROVED,
            outstanding_amount=a.loan_amount,
        )
        db.add(loan)
        db.flush()
        a.loan_id = loan.id
        logger.info(f"Agentic AI auto-approved Loan #{loan.id} for farmer {a.farmer_id}")

    db.commit()
    db.refresh(a)
    return a


@router.post("/{assessment_id}/disburse", response_model=AssessmentResponse)
def disburse_loan(assessment_id: int, db: Session = Depends(get_db)):
    """
    Step 8: Disburse the linked loan (set active + disbursement_date).
    """
    a = db.query(LoanAssessment).filter(LoanAssessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if not a.farmer_accepted or not a.loan_id:
        raise HTTPException(status_code=400, detail="Loan not yet accepted or approved")

    loan = db.query(Loan).filter(Loan.id == a.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Linked loan not found")
    if loan.status == LoanStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Loan already disbursed")

    loan.status = LoanStatus.ACTIVE
    loan.disbursement_date = datetime.utcnow()
    loan.repayment_date = datetime.utcnow() + timedelta(days=365)
    db.commit()
    db.refresh(a)
    logger.info(f"Loan #{loan.id} disbursed for farmer {a.farmer_id}")
    return a


@router.post("/{assessment_id}/repay", response_model=AssessmentResponse)
def mark_repaid(assessment_id: int, db: Session = Depends(get_db)):
    """
    Step 9 (on-time): Farmer repays — interest becomes ₹0 (TN subsidy).
    Sets loan to completed, outstanding=0, interest_rate=0.
    """
    a = db.query(LoanAssessment).filter(LoanAssessment.id == assessment_id).first()
    if not a or not a.loan_id:
        raise HTTPException(status_code=404, detail="Assessment/loan not found")

    loan = db.query(Loan).filter(Loan.id == a.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Linked loan not found")
    if loan.status != LoanStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Loan is not in active state")

    loan.status = LoanStatus.COMPLETED
    loan.outstanding_amount = 0.0
    loan.interest_rate = 0.0   # Tamil Nadu subsidy — interest waived on timely repayment
    loan.repayment_date = datetime.utcnow()
    db.commit()
    db.refresh(a)
    logger.info(f"Loan #{loan.id} repaid on time — interest waived (TN subsidy)")
    return a


@router.post("/{assessment_id}/default", response_model=AssessmentResponse)
def mark_default(assessment_id: int, db: Session = Depends(get_db)):
    """
    Step 9 (default): Farmer fails to repay — AI updates risk score & alerts bank.
    Sets loan to defaulted and updates credit score downward.
    """
    a = db.query(LoanAssessment).filter(LoanAssessment.id == assessment_id).first()
    if not a or not a.loan_id:
        raise HTTPException(status_code=404, detail="Assessment/loan not found")

    loan = db.query(Loan).filter(Loan.id == a.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Linked loan not found")
    if loan.status != LoanStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Loan is not in active state")

    loan.status = LoanStatus.DEFAULTED
    # AI updates risk score
    a.credit_score = max(300, (a.credit_score or 600) - 150)
    a.recommendation = "Reject"
    a.ai_notes = (
        f"ALERT: Loan #{loan.id} defaulted. "
        f"Credit score reduced to {a.credit_score}. "
        f"Bank notified. Future applications will require enhanced scrutiny."
    )
    db.commit()
    db.refresh(a)
    logger.warning(f"Loan #{loan.id} DEFAULTED — farmer {a.farmer_id} credit score updated to {a.credit_score}")
    return a


@router.get("/", response_model=list[AssessmentResponse])
def list_assessments(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """List all assessments (bank view)."""
    return db.query(LoanAssessment).order_by(LoanAssessment.id.desc()).offset(skip).limit(limit).all()
