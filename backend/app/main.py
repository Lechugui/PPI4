from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .routers import courts, reservations, time_slots
from .database import engine, SessionLocal
from . import models, schemas, crud
from .turno import Turno
from .schemas import TurnoOut

# Crear todas las tablas (muy importante)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Paddliemos API",
    description="API for managing paddle court reservations and users",
    version="1.0.0"
)

# Configurar CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Incluir routers de Nico
app.include_router(courts.router)
app.include_router(reservations.router)
app.include_router(time_slots.router)

# Dependencia para sesión de base de datos (de Anna)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints de Anna

@app.get("/users/", response_model=List[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_user(db=db, user=user)

#Modifico para que devuelva los ultimos 3 turnos de un usuario especifico

@app.get("/reservations/ultimos/{user_id}", response_model=List[schemas.ReservationOut])
def obtener_ultimas_reservas_usuario(user_id: int, db: Session = Depends(get_db)):
    return crud.get_last_3_matches(db, user_id)

# comento lo anterior por si hago cagada :D

## @app.get("/turnos/ultimos", response_model=List[TurnoOut])
# def obtener_ultimos_turnos(db: Session = Depends(get_db)):
#     turnos = db.query(Turno).order_by(Turno.fecha.desc(), Turno.hora.desc()).limit(3).all()
#     return turnos

# Endpoints básicos de Nico

@app.get("/")
def read_root():
    return {"message": "corriendo api de paddliemos!"}

@app.get("/health")
def health_check():
    return {"status": "tamos vivos"}