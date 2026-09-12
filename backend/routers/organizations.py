from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from backend.database import get_db
from backend.models import Organization
from backend.schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(organization: OrganizationCreate, db: Session = Depends(get_db)):
    """Create a new farmer producer organization"""
    try:
        # Check if organization name already exists
        existing_org = db.query(Organization).filter(
            Organization.name == organization.name
        ).first()
        if existing_org:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization with this name already exists"
            )
        
        # Check if registration number already exists
        existing_reg = db.query(Organization).filter(
            Organization.registration_number == organization.registration_number
        ).first()
        if existing_reg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization with this registration number already exists"
            )
        
        # Check if email already exists
        existing_email = db.query(Organization).filter(
            Organization.email == organization.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization with this email already exists"
            )
        
        db_org = Organization(**organization.model_dump())
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
        logger.info(f"Created organization with ID: {db_org.id}")
        return db_org
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating organization: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create organization"
        )


@router.get("/", response_model=List[OrganizationResponse])
def list_organizations(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all organizations with pagination"""
    try:
        organizations = db.query(Organization).offset(skip).limit(limit).all()
        return organizations
    except Exception as e:
        logger.error(f"Error listing organizations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve organizations"
        )


@router.get("/{organization_id}", response_model=OrganizationResponse)
def get_organization(organization_id: int, db: Session = Depends(get_db)):
    """Get a specific organization by ID"""
    try:
        organization = db.query(Organization).filter(
            Organization.id == organization_id
        ).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        return organization
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving organization {organization_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve organization"
        )


@router.put("/{organization_id}", response_model=OrganizationResponse)
def update_organization(
    organization_id: int,
    organization_update: OrganizationUpdate,
    db: Session = Depends(get_db)
):
    """Update an organization's information"""
    try:
        db_org = db.query(Organization).filter(
            Organization.id == organization_id
        ).first()
        if not db_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        # Update only provided fields
        update_data = organization_update.model_dump(exclude_unset=True)
        
        # Check for duplicate name if updating
        if "name" in update_data:
            existing = db.query(Organization).filter(
                Organization.name == update_data["name"],
                Organization.id != organization_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Organization name already in use"
                )
        
        # Check for duplicate registration number if updating
        if "registration_number" in update_data:
            existing = db.query(Organization).filter(
                Organization.registration_number == update_data["registration_number"],
                Organization.id != organization_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Registration number already in use"
                )
        
        # Check for duplicate email if updating
        if "email" in update_data:
            existing = db.query(Organization).filter(
                Organization.email == update_data["email"],
                Organization.id != organization_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
        
        for key, value in update_data.items():
            setattr(db_org, key, value)
        
        db.commit()
        db.refresh(db_org)
        logger.info(f"Updated organization with ID: {organization_id}")
        return db_org
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating organization {organization_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update organization"
        )


@router.delete("/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(organization_id: int, db: Session = Depends(get_db)):
    """Delete an organization"""
    try:
        db_org = db.query(Organization).filter(
            Organization.id == organization_id
        ).first()
        if not db_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        
        db.delete(db_org)
        db.commit()
        logger.info(f"Deleted organization with ID: {organization_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting organization {organization_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete organization"
        )
