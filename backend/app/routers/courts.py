from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/courts", tags=["courts"])

@router.get("/", response_model=List[schemas.CourtOut])
def read_courts(
    company_id: Optional[int] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):

    return crud.get_courts(db, company_id=company_id, available_only=available_only)

@router.get("/{court_id}", response_model=schemas.CourtOut)
def read_court(
    court_id: int,
    db: Session = Depends(get_db)
):

    db_court = crud.get_court(db, court_id=court_id)
    if db_court is None:
        raise HTTPException(status_code=404, detail="Court not found")
    return db_court

@router.get("/{court_id}/available-slots", response_model=List[schemas.AvailableTimeSlotOut])
def get_available_slots(
    court_id: int,
    fecha: date,
    db: Session = Depends(get_db)
):
    try:
        db_court = crud.get_court(db, court_id=court_id)
        if db_court is None:
            raise HTTPException(status_code=404, detail="Court not found")

        slots = crud.get_available_time_slots(db, court_id=court_id, fecha=fecha)
        return slots
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
