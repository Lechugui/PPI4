from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date
from . import models, schemas, auth
# --------------------
# CRUD de Usuarios
# --------------------
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.nombre == name).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.contraseña)

    db_user = models.User(
        nombre=user.nombre,
        email=user.email,
        contraseña=hashed_password,
        role_id=user.role_id,
        company_id=user.company_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return db_user
    return None

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        update_data = user_update.model_dump(exclude_unset=True) 
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

# --------------------
# Court CRUD
# --------------------
def get_court(db: Session, court_id: int):
    return db.query(models.Court).filter(models.Court.id == court_id).first()

def get_courts(db: Session, company_id: int = None, available_only: bool = False):
    query = db.query(models.Court)
    if company_id:
        query = query.filter(models.Court.company_id == company_id)
    if available_only:
        query = query.filter(models.Court.disponible == True)
    return query.all()

# --------------------
# TimeSlot CRUD
# --------------------

def get_time_slot(db: Session, time_slot_id: int):
    return db.query(models.TimeSlot).filter(models.TimeSlot.id == time_slot_id).first()

def get_time_slots(db: Session):
    return db.query(models.TimeSlot).order_by(models.TimeSlot.hora_inicio).all()

# --------------------
# Reservation CRUD
# --------------------

def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()

def get_reservations(db: Session, user_id: int = None, court_id: int = None, fecha: date = None):
    query = db.query(models.Reservation)
    if user_id:
        query = query.filter(models.Reservation.user_id == user_id)
    if court_id:
        query = query.filter(models.Reservation.court_id == court_id)
    if fecha:
        query = query.filter(models.Reservation.fecha == fecha)
    return query.all()

def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    existing = db.query(models.Reservation).filter(
        and_(
            models.Reservation.court_id == reservation.court_id,
            models.Reservation.fecha == reservation.fecha,
            models.Reservation.time_slot_id == reservation.time_slot_id,
            models.Reservation.status_id != 3  # "Cancelado"
        )
    ).first()

    if existing:
        raise ValueError("Time slot already booked for this court and date")

    db_reservation = models.Reservation(**reservation.dict())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

def get_available_time_slots(db: Session, court_id: int, fecha: date):
    try:
        all_slots = get_time_slots(db)
        
        booked_reservations = db.query(models.Reservation).filter(
            and_(
                models.Reservation.court_id == court_id,
                models.Reservation.fecha == fecha,
                models.Reservation.status_id != 3  # "Cancelado"
            )
        ).all()

        booked_slot_ids = [r.time_slot_id for r in booked_reservations]

        return [
            {
                "id": slot.id,
                "hora_inicio": slot.hora_inicio,
                "hora_fin": slot.hora_fin,
                "activo": slot.activo,
                "available": bool(slot.id not in booked_slot_ids)  
            }
            for slot in all_slots
        ]
    except Exception as e:
        print(f"Error in get_available_time_slots: {str(e)}")
        raise
