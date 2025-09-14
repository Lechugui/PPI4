from datetime import time, date
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal, engine

# Crear todas las tablas (en caso de que no se hayan migrado)
models.Base.metadata.create_all(bind=engine)

def seed():
    db: Session = SessionLocal()

    # Evitar duplicados si se ejecuta más de una vez
    if db.query(models.User).first():
        print("Seed ya aplicado.")
        db.close()
        return

    # 1. Empresas
    empresa1 = models.Company(nombre="Paddle Club Palermo", direccion="Av. del Libertador 5000")
    empresa2 = models.Company(nombre="Zona Paddle Caballito", direccion="Av. Rivadavia 5800")
    db.add_all([empresa1, empresa2])
    db.commit()

    # 2. Roles
    rol_admin = models.Role(nombre="admin")
    rol_cliente = models.Role(nombre="cliente")
    db.add_all([rol_admin, rol_cliente])
    db.commit()

    # 3. Usuarios
    user1 = models.User(
        nombre="Lucía Pérez",
        email="lucia@gmail.com",
        contraseña="hashed_pwd1",
        role_id=rol_cliente.id,
        company_id=empresa1.id
    )
    user2 = models.User(
        nombre="Carlos Gómez",
        email="carlos@gmail.com",
        contraseña="hashed_pwd2",
        role_id=rol_admin.id,
        company_id=empresa1.id
    )
    db.add_all([user1, user2])
    db.commit()

    # 4. Tipos de cancha
    tipo1 = models.CourtType(nombre="Sintética", descripcion="Césped sintético con buena absorción.")
    tipo2 = models.CourtType(nombre="Cemento", descripcion="Superficie dura y rápida.")
    db.add_all([tipo1, tipo2])
    db.commit()

    # 5. Canchas
    cancha1 = models.Court(
        nombre="Cancha A1",
        ubicación="Sector Norte",
        disponible=True,
        imagen=None,
        type_id=tipo1.id,
        company_id=empresa1.id
    )
    cancha2 = models.Court(
        nombre="Cancha B2",
        ubicación="Sector Sur",
        disponible=True,
        imagen=None,
        type_id=tipo2.id,
        company_id=empresa2.id
    )
    db.add_all([cancha1, cancha2])
    db.commit()

    # 6. Franja horaria
    horario1 = models.TimeSlot(hora_inicio=time(18, 0), hora_fin=time(19, 0))
    horario2 = models.TimeSlot(hora_inicio=time(19, 0), hora_fin=time(20, 0))
    db.add_all([horario1, horario2])
    db.commit()

    estado1 = models.ReservationStatus(nombre="pendiente")
    estado2 = models.ReservationStatus(nombre="confirmada")
    db.add_all([estado1, estado2])
    db.commit()

    reserva1 = models.Reservation(
        user_id=user1.id,
        court_id=cancha1.id,
        fecha=date.today(),
        time_slot_id=horario1.id,
        status_id=estado1.id
    )
    db.add(reserva1)
    db.commit()

    print("Seed ejecutado correctamente.")
    db.close()

if __name__ == "__main__":
    seed()
