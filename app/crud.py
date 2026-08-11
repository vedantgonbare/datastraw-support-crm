from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app import models, schemas


def generate_ticket_id(db: Session) -> str:
    """
    Generates the next sequential ticket ID, e.g. TKT-001, TKT-002...
    Based on the count of existing tickets + 1.
    """
    count = db.query(models.Ticket).count()
    next_number = count + 1
    return f"TKT-{next_number:03d}"


def create_ticket(db: Session, ticket_data: schemas.TicketCreate) -> models.Ticket:
    new_ticket_id = generate_ticket_id(db)

    db_ticket = models.Ticket(
        ticket_id=new_ticket_id,
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        priority=ticket_data.priority or "Medium",
        status="Open",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_tickets(db: Session, status: str | None = None, search: str | None = None):
    query = db.query(models.Ticket)

    if status:
        query = query.filter(models.Ticket.status == status)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Ticket.customer_name.ilike(like_pattern),
                models.Ticket.customer_email.ilike(like_pattern),
                models.Ticket.ticket_id.ilike(like_pattern),
                models.Ticket.description.ilike(like_pattern),
            )
        )

    return query.order_by(models.Ticket.created_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: str) -> models.Ticket | None:
    return db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()


def update_ticket(db: Session, ticket_id: str, update_data: schemas.TicketUpdate) -> models.Ticket | None:
    db_ticket = get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        return None

    if update_data.status:
        db_ticket.status = update_data.status

    if update_data.priority:
        db_ticket.priority = update_data.priority

    if update_data.notes:
        new_note = models.Note(ticket_id=ticket_id, note_text=update_data.notes)
        db.add(new_note)

    db.commit()
    db.refresh(db_ticket)
    return db_ticket