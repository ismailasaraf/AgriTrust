from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from backend.database import Base


class LoanStatus(str, enum.Enum):
    """Loan status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    ACTIVE = "active"
    COMPLETED = "completed"
    DEFAULTED = "defaulted"
    REJECTED = "rejected"


class Farmer(Base):
    """Farmer model representing smallholder farmers"""
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    village = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    farming_type = Column(String(100), nullable=True)
    land_size_acres = Column(Float, nullable=True)
    land_details = Column(Text, nullable=True)
    crop_type = Column(String(255), nullable=True)
    crops_cultivated = Column(Text, nullable=True)
    approx_production = Column(String(255), nullable=True)
    fpo_membership = Column(String(255), nullable=True)
    previous_farming_history = Column(Text, nullable=True)
    market_sold_to = Column(String(255), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="farmers")
    loans = relationship("Loan", back_populates="farmer", cascade="all, delete-orphan")


class Organization(Base):
    """Farmer Producer Organization model"""
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    registration_number = Column(String(100), unique=True, nullable=False)
    contact_person = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    address = Column(Text, nullable=True)
    member_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farmers = relationship("Farmer", back_populates="organization")


class Loan(Base):
    """Loan model representing agricultural loans"""
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    duration_months = Column(Integer, nullable=False)
    purpose = Column(String(255), nullable=False)
    status = Column(Enum(LoanStatus), default=LoanStatus.PENDING, nullable=False)
    disbursement_date = Column(DateTime, nullable=True)
    repayment_date = Column(DateTime, nullable=True)
    outstanding_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farmer = relationship("Farmer", back_populates="loans")
