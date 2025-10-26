from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from .database import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)

    users = relationship("User", back_populates="company")
    courts = relationship("Court", back_populates="company")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)

    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True)
    contraseña = Column(String)

    role_id = Column(Integer, ForeignKey("roles.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))

    role = relationship("Role", back_populates="users")
    company = relationship("Company", back_populates="users")
    reservations = relationship("Reservation", back_populates="user")

class CourtType(Base):
    __tablename__ = "courttypes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    descripcion = Column(String)

    courts = relationship("Court", back_populates="type")

class Court(Base):
    __tablename__ = "courts"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    ubicación = Column(String)
    disponible = Column(Boolean, default=True)
    imagen = Column(String, nullable=True)

    type_id = Column(Integer, ForeignKey("courttypes.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))

    type = relationship("CourtType", back_populates="courts")
    company = relationship("Company", back_populates="courts")
    reservations = relationship("Reservation", back_populates="court")

class TimeSlot(Base):
    __tablename__ = "time_slots"
    id = Column(Integer, primary_key=True, index=True)
    hora_inicio = Column(Time)
    hora_fin = Column(Time)
    activo = Column(Boolean, default=True, nullable=True)

    reservations = relationship("Reservation", back_populates="time_slot")

class ReservationStatus(Base):
    __tablename__ = "reservation_statuses"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)

    reservations = relationship("Reservation", back_populates="status")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    court_id = Column(Integer, ForeignKey("courts.id"))
    fecha = Column(Date)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"))
    status_id = Column(Integer, ForeignKey("reservation_statuses.id"))

    user = relationship("User", back_populates="reservations")
    court = relationship("Court", back_populates="reservations")
    time_slot = relationship("TimeSlot", back_populates="reservations")
    status = relationship("ReservationStatus", back_populates="reservations")
