from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/reservations", tags=["reservations"])

@router.post("/", response_model=schemas.ReservationOut)
def create_reservation(
    reservation: schemas.ReservationCreate,
    db: Session = Depends(get_db)
):
    # crear una reserva

    try:
        return crud.create_reservation(db=db, reservation=reservation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.ReservationOut])
def read_reservations(
    user_id: Optional[int] = None,
    court_id: Optional[int] = None,
    fecha: Optional[date] = None,
    db: Session = Depends(get_db)
):
    # todas las reservas

    return crud.get_reservations(db, user_id=user_id, court_id=court_id, fecha=fecha)

@router.get("/{reservation_id}", response_model=schemas.ReservationOut)
def read_reservation(
    reservation_id: int,
    db: Session = Depends(get_db)
):
    # reservas por id

    db_reservation = crud.get_reservation(db, reservation_id=reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation
