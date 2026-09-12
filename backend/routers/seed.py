from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from backend.database import get_db
from backend.models import Farmer, Organization, Loan, LoanStatus

router = APIRouter()
logger = logging.getLogger(__name__)


def seed_database(db: Session):
    """Seed database with sample Indian agricultural credit data"""
    if db.query(Organization).first() is not None:
        logger.info("Database already contains data, skipping seed.")
        return {"message": "Database already populated", "seeded": False}

    logger.info("Seeding database with sample agricultural credit data...")

    # 1. Create Organizations (FPOs)
    orgs = [
        Organization(
            name="Sahyadri Farmers Producer Co. Ltd.",
            registration_number="FPO/MH/2021/0482",
            contact_person="Vilas Shinde",
            phone="9822011223",
            email="contact@sahyadrifpo.org",
            address="Nashik Highway, Nashik, Maharashtra 422004",
            member_count=1250
        ),
        Organization(
            name="Green Punjab Agro Cooperative",
            registration_number="FPO/PB/2019/1109",
            contact_person="Harpreet Singh Dhillon",
            phone="9814055667",
            email="info@greenpunjabagro.co.in",
            address="GT Road, Ludhiana, Punjab 141001",
            member_count=840
        ),
        Organization(
            name="Karnataka Krishi Vikasa Sangh",
            registration_number="FPO/KA/2020/0734",
            contact_person="Basavaraj Patil",
            phone="9980033445",
            email="support@krishivikasa.org",
            address="APMC Yard, Hubballi, Karnataka 580025",
            member_count=950
        ),
        Organization(
            name="Tamil Nadu Organic Growers FPO",
            registration_number="FPO/TN/2022/1560",
            contact_person="M. Ramaswamy",
            phone="9443077889",
            email="contact@tnorganic.org",
            address="Coimbatore Main Road, Erode, Tamil Nadu 638001",
            member_count=620
        ),
    ]
    db.add_all(orgs)
    db.commit()

    for o in orgs:
        db.refresh(o)

    # 2. Create Farmers
    farmers = [
        Farmer(
            name="Ramesh Kumar",
            phone="9876543210",
            email="ramesh.kumar@example.com",
            address="Village Niphad, Nashik, Maharashtra",
            land_size_acres=4.5,
            crop_type="Wheat & Mustard",
            organization_id=orgs[0].id
        ),
        Farmer(
            name="Gurpreet Singh",
            phone="9812345678",
            email="gurpreet.s@example.com",
            address="Village Jagraon, Ludhiana, Punjab",
            land_size_acres=12.0,
            crop_type="Paddy (Basmati)",
            organization_id=orgs[1].id
        ),
        Farmer(
            name="Venkat Rao",
            phone="9945678901",
            email="venkat.rao@example.com",
            address="Village Navalgund, Dharwad, Karnataka",
            land_size_acres=6.2,
            crop_type="Sugarcane",
            organization_id=orgs[2].id
        ),
        Farmer(
            name="Lakshmi Devi",
            phone="9789012345",
            email="lakshmi.d@example.com",
            address="Village Gobichettipalayam, Erode, Tamil Nadu",
            land_size_acres=3.0,
            crop_type="Cotton & Pulses",
            organization_id=orgs[3].id
        ),
        Farmer(
            name="Rajesh Patel",
            phone="9825012345",
            email="rajesh.patel@example.com",
            address="Village Dindori, Nashik, Maharashtra",
            land_size_acres=8.5,
            crop_type="Groundnut & Spices",
            organization_id=orgs[0].id
        ),
        Farmer(
            name="Sunita Sharma",
            phone="9711223344",
            email="sunita.s@example.com",
            address="Village Samrala, Ludhiana, Punjab",
            land_size_acres=2.8,
            crop_type="Vegetables & Floriculture",
            organization_id=orgs[1].id
        )
    ]
    db.add_all(farmers)
    db.commit()

    for f in farmers:
        db.refresh(f)

    # 3. Create Loans
    now = datetime.utcnow()
    loans = [
        Loan(
            farmer_id=farmers[0].id,
            amount=150000.0,
            interest_rate=7.0,
            duration_months=12,
            purpose="Kisan Credit Card crop cultivation & seeds",
            status=LoanStatus.ACTIVE,
            disbursement_date=now - timedelta(days=90),
            repayment_date=now + timedelta(days=275),
            outstanding_amount=120000.0
        ),
        Loan(
            farmer_id=farmers[1].id,
            amount=450000.0,
            interest_rate=8.5,
            duration_months=36,
            purpose="John Deere 4WD Tractor & harvester financing",
            status=LoanStatus.ACTIVE,
            disbursement_date=now - timedelta(days=180),
            repayment_date=now + timedelta(days=915),
            outstanding_amount=310000.0
        ),
        Loan(
            farmer_id=farmers[2].id,
            amount=200000.0,
            interest_rate=7.5,
            duration_months=24,
            purpose="Micro-irrigation drip pipeline installation",
            status=LoanStatus.APPROVED,
            disbursement_date=None,
            repayment_date=None,
            outstanding_amount=200000.0
        ),
        Loan(
            farmer_id=farmers[3].id,
            amount=75000.0,
            interest_rate=7.0,
            duration_months=12,
            purpose="Bio-fertilizers and organic pest control",
            status=LoanStatus.COMPLETED,
            disbursement_date=now - timedelta(days=400),
            repayment_date=now - timedelta(days=35),
            outstanding_amount=0.0
        ),
        Loan(
            farmer_id=farmers[4].id,
            amount=300000.0,
            interest_rate=8.0,
            duration_months=18,
            purpose="Solar powered water pump installation",
            status=LoanStatus.PENDING,
            disbursement_date=None,
            repayment_date=None,
            outstanding_amount=300000.0
        ),
        Loan(
            farmer_id=farmers[5].id,
            amount=120000.0,
            interest_rate=9.0,
            duration_months=12,
            purpose="Polyhouse vegetable nursery setup",
            status=LoanStatus.REJECTED,
            disbursement_date=None,
            repayment_date=None,
            outstanding_amount=0.0
        ),
        Loan(
            farmer_id=farmers[0].id,
            amount=80000.0,
            interest_rate=7.0,
            duration_months=6,
            purpose="Emergency wheat harvest machinery rental",
            status=LoanStatus.COMPLETED,
            disbursement_date=now - timedelta(days=210),
            repayment_date=now - timedelta(days=30),
            outstanding_amount=0.0
        ),
        Loan(
            farmer_id=farmers[1].id,
            amount=250000.0,
            interest_rate=8.2,
            duration_months=24,
            purpose="Cold storage warehouse booking deposit",
            status=LoanStatus.DEFAULTED,
            disbursement_date=now - timedelta(days=500),
            repayment_date=now - timedelta(days=100),
            outstanding_amount=185000.0
        )
    ]
    db.add_all(loans)
    db.commit()

    logger.info("Database seeding complete!")
    return {
        "message": "Database seeded successfully",
        "seeded": True,
        "counts": {
            "organizations": len(orgs),
            "farmers": len(farmers),
            "loans": len(loans)
        }
    }


@router.post("/", status_code=status.HTTP_200_OK)
def seed_data(db: Session = Depends(get_db)):
    """Seed initial sample data"""
    try:
        return seed_database(db)
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed database: {str(e)}"
        )
