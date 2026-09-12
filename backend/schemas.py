from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from backend.models import LoanStatus


# Farmer Schemas
class FarmerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    village: Optional[str] = None
    address: Optional[str] = None
    farming_type: Optional[str] = None
    land_size_acres: Optional[float] = Field(None, ge=0)
    land_details: Optional[str] = None
    crop_type: Optional[str] = Field(None, max_length=255)
    crops_cultivated: Optional[str] = None
    approx_production: Optional[str] = None
    fpo_membership: Optional[str] = None
    previous_farming_history: Optional[str] = None
    market_sold_to: Optional[str] = None
    organization_id: Optional[int] = None


class FarmerCreate(FarmerBase):
    pass


class FarmerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    village: Optional[str] = None
    address: Optional[str] = None
    farming_type: Optional[str] = None
    land_size_acres: Optional[float] = Field(None, ge=0)
    land_details: Optional[str] = None
    crop_type: Optional[str] = Field(None, max_length=255)
    crops_cultivated: Optional[str] = None
    approx_production: Optional[str] = None
    fpo_membership: Optional[str] = None
    previous_farming_history: Optional[str] = None
    market_sold_to: Optional[str] = None
    organization_id: Optional[int] = None


class VoiceParseRequest(BaseModel):
    transcript: str = Field(..., min_length=1)
    language: Optional[str] = Field("en-US")


class VoiceParseResponse(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    village: Optional[str] = None
    farming_type: Optional[str] = None
    land_size_acres: Optional[float] = None
    land_details: Optional[str] = None
    crops_cultivated: Optional[str] = None
    approx_production: Optional[str] = None
    fpo_membership: Optional[str] = None
    previous_farming_history: Optional[str] = None
    market_sold_to: Optional[str] = None
    extracted_summary: Optional[str] = None


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
