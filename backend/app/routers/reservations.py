from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import crud, schemas, models
from ..database import get_db
from .login import get_current_user

router = APIRouter(prefix="/reservations", tags=["reservations"])

@router.post("/", response_model=schemas.ReservationOut)
def create_reservation(
    reservation: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        return crud.create_reservation(db=db, reservation=reservation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.ReservationOut])
def read_reservations(
    user_id: Optional[int] = None,
    court_id: Optional[int] = None,
    fecha: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_reservations(db, user_id=user_id, court_id=court_id, fecha=fecha)

# --- RUTA ESTÁTICA para evitar chocar con "/{reservation_id}"
@router.get("/available-slots", response_model=List[schemas.AvailableTimeSlotOut])
def read_available_slots( 
    court_id: int = Query(...),
    fecha: date = Query(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
): 
    return crud.get_available_time_slots(db, court_id=court_id, fecha=fecha)  

@router.put("/reservation/{reservation_id}", response_model=schemas.ReservationOut)
async def update_reservation(
    reservation_id: int,
    reservation_update: schemas.ReservationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
        updated_reservation = crud.update_reservation(
            db, reservation_id=reservation_id, reservation_update=reservation_update
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not updated_reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reserva con ID {reservation_id} no encontrada."
        )
    return updated_reservation

@router.delete("/reservation/{reservation_id}", response_model=dict)
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    deleted_id = crud.delete_reservation(db, reservation_id=reservation_id)
    if deleted_id is None:
        raise HTTPException(status_code=404, detail=f"Reserva con ID {reservation_id} no encontrada.")
    return {"message": f"Reserva con ID {deleted_id} eliminada exitosamente."}

@router.get("/{reservation_id}", response_model=schemas.ReservationOut)
def read_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_reservation = crud.get_reservation(db, reservation_id=reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@router.get("/{user_id}/last-matches", response_model=List[schemas.ReservationOut])
def read_last_matches(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    matches = crud.get_last_3_matches(db, user_id=user_id)
    if not matches:
        raise HTTPException(status_code=404, detail="No matches found for this user")
    return matches