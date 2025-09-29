from pydantic import BaseModel, EmailStr
from datetime import date, time

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
    contraseña: str
    role_id: int
    company_id: int | None = None

class UserOut(UserBase):
    id: int
    role: RoleOut | None = None
    company: CompanyOut | None = None

    class Config:
        orm_mode = True

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
    activo: bool | None = True

    class Config:
        from_attributes = True

# Add this after the TimeSlotOut class
class AvailableTimeSlotOut(TimeSlotOut):
    available: bool

    class Config:
        from_attributes = True

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

# --------------------
# Turno 
# --------------------
class TurnoOut(BaseModel):
    id: int
    usuario_id: int
    fecha: date
    descripcion: str | None = None
    estado: str = "pendiente"  # Default state

    class Config:
        orm_mode = True
