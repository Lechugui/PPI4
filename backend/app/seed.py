import sqlite3
import os
from datetime import datetime, time, date, timedelta
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal, engine

# crear todas las tablas si no se migró
models.Base.metadata.create_all(bind=engine)

def seed():
    db: Session = SessionLocal()

    # 1. Companies
    companies = [
        models.Company(nombre="Paddle Club Palermo", direccion="Av. del Libertador 5000"),
        models.Company(nombre="Zona Paddle Caballito", direccion="Av. Rivadavia 5800"),
        models.Company(nombre="Paddle Center Belgrano", direccion="Av. Cabildo 2500")
    ]
    db.add_all(companies)
    db.commit()

    # 2. Roles
    roles = [
        models.Role(nombre="admin"),
        models.Role(nombre="cliente")
    ]
    db.add_all(roles)
    db.commit()

    # 3. Users
    users = [
        models.User(
            nombre="Admin Sistema",
            email="admin@paddliemos.com",
            contraseña="admin123",  # TODO: hashed passwords
            telefono="1155667788",
            role_id=roles[0].id,
            company_id=companies[0].id
        ),
        models.User(
            nombre="Lucía Pérez",
            email="lucia@gmail.com",
            contraseña="password123",
            telefono="1145678901",
            role_id=roles[1].id,
            company_id=companies[0].id
        ),
        models.User(
            nombre="Carlos Gómez",
            email="carlos@gmail.com",
            contraseña="password123",
            telefono="1156789012",
            role_id=roles[1].id,
            company_id=companies[0].id
        ),
        models.User(
            nombre="María Rodríguez",
            email="maria@gmail.com",
            contraseña="password123",
            telefono="1167890123",
            role_id=roles[1].id,
            company_id=companies[1].id
        ),
        models.User(
            nombre="Juan Martínez",
            email="juan@gmail.com",
            contraseña="password123",
            telefono="1178901234",
            role_id=roles[1].id,
            company_id=companies[1].id
        )
    ]
    db.add_all(users)
    db.commit()

    # 4. Court Types
    court_types = [
        models.CourtType(nombre="Sintética", descripcion="Césped sintético con buena absorción"),
        models.CourtType(nombre="Cemento", descripcion="Superficie dura y rápida"),
        models.CourtType(nombre="Cristal", descripcion="Paredes de cristal para mejor visibilidad")
    ]
    db.add_all(court_types)
    db.commit()

    # 5. Courts
    courts = [
        models.Court(
            nombre="Cancha A1",
            ubicacion="Sector Norte",
            disponible=True,
            precio_por_hora=5000,
            type_id=court_types[0].id,
            company_id=companies[0].id
        ),
        models.Court(
            nombre="Cancha A2",
            ubicacion="Sector Norte",
            disponible=True,
            precio_por_hora=5000,
            type_id=court_types[0].id,
            company_id=companies[0].id
        ),
        models.Court(
            nombre="Cancha B1",
            ubicacion="Sector Sur",
            disponible=True,
            precio_por_hora=6000,
            type_id=court_types[1].id,
            company_id=companies[0].id
        ),
        models.Court(
            nombre="Cancha C1",
            ubicacion="Sector Central",
            disponible=True,
            precio_por_hora=7000,
            type_id=court_types[2].id,
            company_id=companies[0].id
        ),
        models.Court(
            nombre="Cancha Principal",
            ubicacion="Entrada",
            disponible=True,
            precio_por_hora=8000,
            type_id=court_types[2].id,
            company_id=companies[1].id
        )
    ]
    db.add_all(courts)
    db.commit()

    # 6. Time Slots (8:00 to 22:00 with 1-hour intervals)
    time_slots = []
    for hour in range(8, 22):
        time_slots.append(models.TimeSlot(
            hora_inicio=time(hour, 0),
            hora_fin=time(hour + 1, 0),
            activo=True
        ))
    db.add_all(time_slots)
    db.commit()

    # 7. Reservation Statuses
    statuses = [
        models.ReservationStatus(nombre="confirmada"),
        models.ReservationStatus(nombre="cancelada"),
        models.ReservationStatus(nombre="pendiente"),
        models.ReservationStatus(nombre="completada")
    ]
    db.add_all(statuses)
    db.commit()

    # 8. Sample Reservations
    today = date.today()
    reservations = [
        models.Reservation(
            fecha=today,
            user_id=users[1].id,
            court_id=courts[0].id,
            time_slot_id=time_slots[2].id,  # 10:00-11:00
            status_id=statuses[0].id,  # confirmada
            notas="Primera reserva"
        ),
        models.Reservation(
            fecha=today,
            user_id=users[2].id,
            court_id=courts[1].id,
            time_slot_id=time_slots[4].id,  # 12:00-13:00
            status_id=statuses[0].id  # confirmada
        ),
        models.Reservation(
            fecha=today + timedelta(days=1),
            user_id=users[3].id,
            court_id=courts[2].id,
            time_slot_id=time_slots[7].id,  # 15:00-16:00
            status_id=statuses[0].id,  # confirmada
            notas="Partido amistoso"
        ),
        models.Reservation(
            fecha=today + timedelta(days=1),
            user_id=users[4].id,
            court_id=courts[3].id,
            time_slot_id=time_slots[9].id,  # 17:00-18:00
            status_id=statuses[0].id  # confirmada
        ),
        models.Reservation(
            fecha=today - timedelta(days=1),
            user_id=users[1].id,
            court_id=courts[4].id,
            time_slot_id=time_slots[10].id,  # 18:00-19:00
            status_id=statuses[3].id,  # completada
            notas="Clase con profesor"
        ),
        models.Reservation(
            fecha=today - timedelta(days=2),
            user_id=users[2].id,
            court_id=courts[0].id,
            time_slot_id=time_slots[3].id,  # 11:00-12:00
            status_id=statuses[1].id,  # cancelada
            notas="Cancelado por lluvia"
        )
    ]
    db.add_all(reservations)
    db.commit()

    print("Seed executed successfully.")
    db.close()

def seed_time_slots():
    db: Session = SessionLocal()
    
    # Clear existing time slots
    db.query(models.TimeSlot).delete()
    db.commit()
    
    # Create new time slots
    time_slots = []
    for hour in range(8, 22):
        time_slots.append(models.TimeSlot(
            hora_inicio=time(hour, 0),
            hora_fin=time(hour + 1, 0)
        ))
    
    db.add_all(time_slots)
    db.commit()
    print("Time slots created successfully.")
    db.close()

if __name__ == "__main__":
    seed_time_slots()
