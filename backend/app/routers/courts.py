from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import crud, schemas, models
from ..database import get_db
from .login import get_current_user

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

@router.post("/", response_model=schemas.CourtOut)
def create_court_endpoint(court: schemas.CourtCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        db_type = db.query(models.CourtType).filter(models.CourtType.id == court.type_id).first()
        if not db_type:
            raise HTTPException(
                status_code=400,
                detail="The specified court type does not exist"
            )
        db_company = db.query(models.Company).filter(models.Company.id == court.company_id).first()
        if not db_company:
            raise HTTPException(
                status_code=400,
                detail="The specified company does not exist"
            )
        court_data = court.dict()
        created_court = crud.create_court(db=db, court_data=court_data)
        if not created_court:
            raise HTTPException(
                status_code=400,
                detail="The court could not be created"
            )
        return created_court
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error: {str(e)}"
        )

@router.put("/{court_id}", response_model=schemas.CourtOut)
def update_court(
    court_id: int, 
    court_data: schemas.CourtUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        # Verificar que la cancha existe primero
        existing_court = crud.get_court(db, court_id=court_id)
        if not existing_court:
            raise HTTPException(
                status_code=400,
                detail="Court not found"
            )
        
        # Verificar type_id si se está actualizando
        if court_data.type_id is not None:
            db_type = db.query(models.CourtType).get(court_data.type_id)
            if not db_type:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid court type ID"
                )
        
        # Verificar company_id si se está actualizando
        if court_data.company_id is not None:
            db_company = db.query(models.Company).get(court_data.company_id)
            if not db_company:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid company ID"
                )
        
        # Actualizar la cancha
        updated_court = crud.update_court(db, court_id=court_id, court_data=court_data)
        return updated_court
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error updating court: {str(e)}"
        )

@router.delete("/{court_id}")
def delete_court(court_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Verificar si la cancha existe
    db_court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not db_court:
        raise HTTPException(
            status_code=404,
            detail="Court not found"
        )
    
    # Verificar reservas directamente
    has_reservations = db.query(models.Reservation)\
                       .filter(models.Reservation.court_id == court_id)\
                       .first() is not None
    
    if has_reservations:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete court with existing reservations"
        )
    
    # Eliminar la cancha
    db.delete(db_court)
    db.commit()
    
    return {"message": "Court deleted successfully"}