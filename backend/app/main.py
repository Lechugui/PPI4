from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import courts, reservations, time_slots, login
from .database import engine
from . import models

# crear todas las tablas mucho muy importante
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Paddliemos API",
    description="API for managing paddle court reservations",
    version="1.0.0"
) 

# configurar CORS
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

# incluyas las rutas
app.include_router(courts.router)
app.include_router(reservations.router)
app.include_router(time_slots.router)
app.include_router(login.router)

@app.get("/")
def read_root():
    return {"message": "corriendo api de paddliemos!"}

@app.get("/health")
def health_check():
    return {"status": "tamos vivos"}
