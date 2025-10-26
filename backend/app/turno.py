from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Turno(Base):
    __tablename__ = 'turnos'
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, index=True)
    fecha = Column(DateTime, nullable=False)
    descripcion = Column(String, nullable=True)
    estado = Column(String, default="pendiente")  
