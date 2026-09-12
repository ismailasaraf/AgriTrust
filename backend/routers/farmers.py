from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

import re
from backend.database import get_db
from backend.models import Farmer
from backend.schemas import FarmerCreate, FarmerUpdate, FarmerResponse, VoiceParseRequest, VoiceParseResponse
from backend.ml_engine import (
    compute_credit_score,
    predict_repayment_capacity,
    evaluate_risk_matrix,
    get_agmarknet_price_trends,
    generate_agricredit_passport
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/ai-market-prices")
def get_market_prices():
    """Retrieve AGMARKNET market price trends for major crops"""
    return get_agmarknet_price_trends()


@router.get("/{farmer_id}/passport")
def get_farmer_passport(farmer_id: int, db: Session = Depends(get_db)):
    """Generate official digital AgriCredit Passport for a farmer"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    return generate_agricredit_passport(farmer)


@router.get("/{farmer_id}/credit-analysis")
def get_farmer_credit_analysis(farmer_id: int, db: Session = Depends(get_db)):
    """Retrieve AI/ML credit score, repayment probability, and risk analysis"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    return {
        "farmer_id": farmer_id,
        "name": farmer.name,
        "credit_score": compute_credit_score(farmer),
        "repayment_prediction": predict_repayment_capacity(farmer),
        "risk_matrix": evaluate_risk_matrix(
            crop_type=farmer.crops_cultivated or farmer.crop_type or "",
            farming_type=farmer.farming_type or ""
        )
    }


@router.post("/voice-parse", response_model=VoiceParseResponse)
def parse_voice_registration(payload: VoiceParseRequest):
    """Parse spoken text into structured farmer registration fields"""
    transcript = payload.transcript.strip()
    text = transcript.lower()
    
    res = VoiceParseResponse(extracted_summary=f"Parsed from spoken input: '{transcript}'")
    
    # 1. Phone number (10 digits)
    phone_match = re.search(r'\b[6-9]\d{9}\b', text) or re.search(r'\b\d{10}\b', text)
    if phone_match:
        res.phone = phone_match.group(0)
        
    # 2. Name
    name_match = re.search(r'(?:my name is|i am|name is|farmer name is|this is)\s+([a-zA-Z\s]{2,30})(?=\s+(?:from|village|phone|farming|cultivating|my|living)|$|\.|\,)', text, re.IGNORECASE)
    if name_match:
        res.name = name_match.group(1).strip().title()
    elif not res.name:
        # Fallback: first two capitalized or words if simple transcript
        first_part = transcript.split(',')[0].split('.')[0]
        words = [w for w in first_part.split() if w.lower() not in ['my', 'name', 'is', 'i', 'am', 'from', 'a', 'farmer']]
        if words and len(words) <= 3:
            res.name = " ".join(words).title()

    # 3. Village
    village_match = re.search(r'(?:from|village|living in|located in|resident of)\s+([a-zA-Z\s]{2,30})(?=\s+(?:village|district|state|and|phone|farming|growing|acres)|$|\.|\,)', text, re.IGNORECASE)
    if village_match:
        v_name = village_match.group(1).strip().title()
        res.village = v_name.replace("Village", "").strip()
    
    # 4. Farming Type
    if "organic" in text:
        res.farming_type = "Organic Farming"
    elif "commercial" in text:
        res.farming_type = "Commercial Farming"
    elif "subsistence" in text:
        res.farming_type = "Subsistence Farming"
    elif "mixed" in text or "integrated" in text:
        res.farming_type = "Integrated / Mixed Farming"
    else:
        res.farming_type = "Traditional / General"

    # 5. Land size acres
    land_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acres|acre|hectares|bigha)', text)
    if land_match:
        val = float(land_match.group(1))
        if "hectare" in text:
            val = round(val * 2.471, 2)
        elif "bigha" in text:
            val = round(val * 0.4, 2)
        res.land_size_acres = val
        res.land_details = f"{val} Acres irrigated agricultural land"

    # 6. Crops cultivated
    crop_keywords = ["wheat", "rice", "paddy", "cotton", "sugarcane", "maize", "pulses", "mustard", "soybean", "tomato", "onion", "chilli", "potato", "groundnut", "millets", "spices"]
    found_crops = [c.capitalize() for c in crop_keywords if c in text]
    if found_crops:
        res.crops_cultivated = ", ".join(found_crops)
    else:
        res.crops_cultivated = "Wheat, Rice"

    # 7. Approximate Production
    prod_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:quintals|quintal|tons|tonnes|kg|bags)', text)
    if prod_match:
        res.approx_production = f"{prod_match.group(0).title()} per harvest season"
    else:
        res.approx_production = "approx 45 Quintals / season"

    # 8. FPO Membership
    if "fpo" in text or "cooperative" in text or "member" in text:
        res.fpo_membership = "Yes - Active Member of Local FPO"
    else:
        res.fpo_membership = "No - Independent Farmer"

    # 9. Farming History
    exp_match = re.search(r'(\d+)\s*(?:years|yr|year)\s*(?:experience|history|farming)?', text)
    if exp_match:
        res.previous_farming_history = f"{exp_match.group(1)} years of active crop cultivation"
    else:
        res.previous_farming_history = "Over 5 years of successful farming history"

    # 10. Market sold to
    if "mandi" in text or "apmc" in text:
        res.market_sold_to = "APMC Mandi (Government Market)"
    elif "trader" in text or "middlemen" in text:
        res.market_sold_to = "Local Market Trader"
    elif "direct" in text or "consumer" in text:
        res.market_sold_to = "Direct Consumer Sales"
    elif "contract" in text:
        res.market_sold_to = "Contract Farming Company"
    else:
        res.market_sold_to = "APMC Mandi & Local Traders"

    return res


@router.post("/", response_model=FarmerResponse, status_code=status.HTTP_201_CREATED)
def create_farmer(farmer: FarmerCreate, db: Session = Depends(get_db)):
    """Create a new farmer"""
    try:
        # Check if phone already exists
        existing_farmer = db.query(Farmer).filter(Farmer.phone == farmer.phone).first()
        if existing_farmer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farmer with this phone number already exists"
            )
        
        # Check if email already exists (if provided)
        if farmer.email:
            existing_email = db.query(Farmer).filter(Farmer.email == farmer.email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Farmer with this email already exists"
                )
        
        db_farmer = Farmer(**farmer.model_dump())
        db.add(db_farmer)
        db.commit()
        db.refresh(db_farmer)
        logger.info(f"Created farmer with ID: {db_farmer.id}")
        return db_farmer
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating farmer: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create farmer"
        )


@router.get("/", response_model=List[FarmerResponse])
def list_farmers(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all farmers with pagination"""
    try:
        farmers = db.query(Farmer).offset(skip).limit(limit).all()
        return farmers
    except Exception as e:
        logger.error(f"Error listing farmers: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve farmers"
        )


@router.get("/{farmer_id}", response_model=FarmerResponse)
def get_farmer(farmer_id: int, db: Session = Depends(get_db)):
    """Get a specific farmer by ID"""
    try:
        farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        return farmer
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving farmer {farmer_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve farmer"
        )


@router.put("/{farmer_id}", response_model=FarmerResponse)
def update_farmer(farmer_id: int, farmer_update: FarmerUpdate, db: Session = Depends(get_db)):
    """Update a farmer's information"""
    try:
        db_farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not db_farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        # Update only provided fields
        update_data = farmer_update.model_dump(exclude_unset=True)
        
        # Check for duplicate phone if updating
        if "phone" in update_data:
            existing = db.query(Farmer).filter(
                Farmer.phone == update_data["phone"],
                Farmer.id != farmer_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already in use"
                )
        
        # Check for duplicate email if updating
        if "email" in update_data and update_data["email"]:
            existing = db.query(Farmer).filter(
                Farmer.email == update_data["email"],
                Farmer.id != farmer_id
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
        
        for key, value in update_data.items():
            setattr(db_farmer, key, value)
        
        db.commit()
        db.refresh(db_farmer)
        logger.info(f"Updated farmer with ID: {farmer_id}")
        return db_farmer
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating farmer {farmer_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update farmer"
        )


@router.delete("/{farmer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farmer(farmer_id: int, db: Session = Depends(get_db)):
    """Delete a farmer"""
    try:
        db_farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if not db_farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        db.delete(db_farmer)
        db.commit()
        logger.info(f"Deleted farmer with ID: {farmer_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting farmer {farmer_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete farmer"
        )
