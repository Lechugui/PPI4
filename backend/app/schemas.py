from pydantic import BaseModel, EmailStr, field_validator
from datetime import date, time
from typing import Optional

# --------------------
# Company
# --------------------
class CompanyBase(BaseModel):
    nombre: str
    direccion: str

class CompanyCreate(CompanyBase):
    pass

class CompanyOut(CompanyBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# Role
# --------------------
class RoleBase(BaseModel):
    nombre: str

class RoleCreate(RoleBase):
    pass

class RoleOut(RoleBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# User
# --------------------
class UserBase(BaseModel):
    nombre: str
    email: EmailStr

class UserCreate(UserBase):
<<<<<<< HEAD
    contraseña: str
=======
    contraseña: str 
>>>>>>> origin/develop-nico
    role_id: int
    company_id: int | None = None

class UserOut(UserBase):
    id: int
    role: RoleOut | None = None
    company: CompanyOut | None = None

<<<<<<< HEAD
    class Config:
        orm_mode = True
=======
    nombre: str
    email: str

    class Config:
        from_attributes = True 

class UserLogin(BaseModel):
    email: EmailStr
    contraseña: str
                                           
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    user_name: str
    user_email: str
    role_id: int
    class Config:
        from_attributes = True 

class TokenData(BaseModel):
    email: str | None = None

class UserNombreResponse(BaseModel):
    nombre: str

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
>>>>>>> origin/develop-nico

# --------------------
# CourtType
# --------------------
class CourtTypeBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class CourtTypeCreate(CourtTypeBase):
    pass

class CourtTypeOut(CourtTypeBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# Court
# --------------------
class CourtBase(BaseModel):
    nombre: str
    ubicación: str
    disponible: bool = True
    imagen: str | None = None
    type_id: int
    company_id: int

class CourtCreate(CourtBase):
    pass

<<<<<<< HEAD
=======
class CourtUpdate(BaseModel):
    nombre: Optional[str] = None
    ubicación: Optional[str] = None
    disponible: Optional[bool] = None
    imagen: Optional[str] = None
    type_id: Optional[int] = None
    company_id: Optional[int] = None

>>>>>>> origin/develop-nico
class CourtOut(CourtBase):
    id: int
    type: CourtTypeOut | None = None
    company: CompanyOut | None = None

    class Config:
        orm_mode = True

# --------------------
# TimeSlot
# --------------------
class TimeSlotBase(BaseModel):
    hora_inicio: time
    hora_fin: time

class TimeSlotCreate(TimeSlotBase):
    pass

class TimeSlotOut(TimeSlotBase):
    id: int
<<<<<<< HEAD

    class Config:
        orm_mode = True
=======
    activo: bool | None = True

    class Config:
        from_attributes = True

# Add this after the TimeSlotOut class
class AvailableTimeSlotOut(TimeSlotOut):
    available: bool

    class Config:
        from_attributes = True
>>>>>>> origin/develop-nico

# --------------------
# ReservationStatus
# --------------------
class ReservationStatusBase(BaseModel):
    nombre: str

class ReservationStatusCreate(ReservationStatusBase):
    pass

class ReservationStatusOut(ReservationStatusBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# Reservation
# --------------------
class ReservationBase(BaseModel):
    user_id: int
    court_id: int
    fecha: date
    time_slot_id: int
    status_id: int

class ReservationCreate(ReservationBase):
    pass

class ReservationOut(ReservationBase):
    id: int
    user: UserOut | None = None
    court: CourtOut | None = None
    time_slot: TimeSlotOut | None = None
    status: ReservationStatusOut | None = None

    class Config:
        orm_mode = True
<<<<<<< HEAD
=======

class ReservationUpdate(BaseModel):
    user_id: Optional[int] = None
    court_id: Optional[int] = None
    fecha: Optional[date] = None
    time_slot_id: Optional[int] = None
    status_id: Optional[int] = None

    # Acepta strings ISO YYYY-MM-DD para fecha
    @field_validator("fecha", mode="before")
    @classmethod
    def parse_fecha(cls, v):
        if v in (None, ""):
            return None
        if isinstance(v, date):
            return v
        try:
            return date.fromisoformat(v)  
        except Exception:
            raise ValueError("fecha debe tener formato YYYY-MM-DD")
# --------------------
# Turno 
# --------------------
class TurnoOut(BaseModel):
    id: int
    usuario_id: int
    fecha: date
    descripcion: str | None = None
    estado: str = "pendiente"  

    class Config:
        orm_mode = True
>>>>>>> origin/develop-nico
