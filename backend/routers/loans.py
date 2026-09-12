from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from backend.database import get_db
from backend.models import Loan, Farmer
from backend.schemas import LoanCreate, LoanUpdate, LoanResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    """Create a new loan"""
    try:
        # Verify farmer exists
        farmer = db.query(Farmer).filter(Farmer.id == loan.farmer_id).first()
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        db_loan = Loan(**loan.model_dump())
        db_loan.outstanding_amount = loan.amount  # Initialize outstanding amount
        db.add(db_loan)
        db.commit()
        db.refresh(db_loan)
        logger.info(f"Created loan with ID: {db_loan.id} for farmer {loan.farmer_id}")
        return db_loan
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating loan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create loan"
        )


@router.get("/", response_model=List[LoanResponse])
def list_loans(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all loans with pagination"""
    try:
        loans = db.query(Loan).offset(skip).limit(limit).all()
        return loans
    except Exception as e:
        logger.error(f"Error listing loans: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve loans"
        )


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(loan_id: int, db: Session = Depends(get_db)):
    """Get a specific loan by ID"""
    try:
        loan = db.query(Loan).filter(Loan.id == loan_id).first()
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan not found"
            )
        return loan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving loan {loan_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve loan"
        )


@router.put("/{loan_id}", response_model=LoanResponse)
def update_loan(loan_id: int, loan_update: LoanUpdate, db: Session = Depends(get_db)):
    """Update a loan's information"""
    try:
        db_loan = db.query(Loan).filter(Loan.id == loan_id).first()
        if not db_loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan not found"
            )
        
        # Update only provided fields
        update_data = loan_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_loan, key, value)
        
        db.commit()
        db.refresh(db_loan)
        logger.info(f"Updated loan with ID: {loan_id}")
        return db_loan
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating loan {loan_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update loan"
        )


@router.delete("/{loan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    """Delete a loan"""
    try:
        db_loan = db.query(Loan).filter(Loan.id == loan_id).first()
        if not db_loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan not found"
            )
        
        db.delete(db_loan)
        db.commit()
        logger.info(f"Deleted loan with ID: {loan_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting loan {loan_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete loan"
        )
