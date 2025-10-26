from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/time-slots", tags=["time-slots"])

@router.get("/", response_model=List[schemas.TimeSlotOut])
def read_time_slots(
    db: Session = Depends(get_db)
):

    return crud.get_time_slots(db)

@router.get("/{time_slot_id}", response_model=schemas.TimeSlotOut)
def read_time_slot(
    time_slot_id: int,
    db: Session = Depends(get_db)
):
    db_time_slot = crud.get_time_slot(db, time_slot_id=time_slot_id)
    if db_time_slot is None:
        raise HTTPException(status_code=404, detail="Time slot not found")
    return db_time_slot
