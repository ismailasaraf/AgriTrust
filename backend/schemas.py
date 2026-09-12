from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any, Dict
from datetime import datetime
from backend.models import LoanStatus


# Farmer Schemas
class FarmerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    land_size_acres: Optional[float] = Field(None, ge=0)
    crop_type: Optional[str] = Field(None, max_length=100)
    organization_id: Optional[int] = None


class FarmerCreate(FarmerBase):
    pass


class FarmerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    land_size_acres: Optional[float] = Field(None, ge=0)
    crop_type: Optional[str] = Field(None, max_length=100)
    organization_id: Optional[int] = None


class FarmerResponse(FarmerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Organization Schemas
class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    registration_number: str = Field(..., min_length=1, max_length=100)
    contact_person: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=10, max_length=20)
    email: EmailStr
    address: Optional[str] = None
    member_count: int = Field(default=0, ge=0)


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    registration_number: Optional[str] = Field(None, min_length=1, max_length=100)
    contact_person: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    member_count: Optional[int] = Field(None, ge=0)


class OrganizationResponse(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Loan Schemas
class LoanBase(BaseModel):
    farmer_id: int
    amount: float = Field(..., gt=0)
    interest_rate: float = Field(..., ge=0, le=100)
    duration_months: int = Field(..., gt=0)
    purpose: str = Field(..., min_length=1, max_length=255)


class LoanCreate(LoanBase):
    pass


class LoanUpdate(BaseModel):
    farmer_id: Optional[int] = None
    amount: Optional[float] = Field(None, gt=0)
    interest_rate: Optional[float] = Field(None, ge=0, le=100)
    duration_months: Optional[int] = Field(None, gt=0)
    purpose: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[LoanStatus] = None
    disbursement_date: Optional[datetime] = None
    repayment_date: Optional[datetime] = None
    outstanding_amount: Optional[float] = Field(None, ge=0)


class LoanResponse(LoanBase):
    id: int
    status: LoanStatus
    disbursement_date: Optional[datetime]
    repayment_date: Optional[datetime]
    outstanding_amount: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# AI Assessment Schemas
class AssessmentRequest(BaseModel):
    farmer_id: int
    loan_amount: float = Field(..., gt=0)
    crop_type: str = Field(..., min_length=1, max_length=100)
    land_size_acres: float = Field(..., gt=0)


class AssessmentResponse(BaseModel):
    id: int
    farmer_id: int
    loan_amount: float
    crop_type: str
    land_size_acres: float

    # AI Data Sources
    market_price_per_quintal: Optional[float]
    rainfall_mm: Optional[float]
    weather_risk_score: Optional[float]
    insurance_risk_score: Optional[float]
    disease_risk_score: Optional[float]

    # AI Analysis
    estimated_yield_quintals: Optional[float]
    projected_revenue: Optional[float]
    projected_profit: Optional[float]
    projected_loss: Optional[float]
    seasonal_risk: Optional[str]
    credit_score: Optional[int]
    recommendation: Optional[str]
    ai_notes: Optional[str]

    # Lifecycle
    document_generated: bool
    farmer_accepted: bool
    farmer_accepted_at: Optional[datetime]
    loan_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FarmerAcceptPayload(BaseModel):
    assessment_id: int
