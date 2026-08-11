from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.post("", response_model=schemas.TicketCreateResponse, status_code=201)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    db_ticket = crud.create_ticket(db, ticket)
    return db_ticket


@router.get("", response_model=list[schemas.TicketListItem])
def list_tickets(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if status and status not in schemas.VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {schemas.VALID_STATUSES}")

    return crud.get_tickets(db, status=status, search=search)


@router.get("/{ticket_id}", response_model=schemas.TicketDetail)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    db_ticket = crud.get_ticket_by_id(db, ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return db_ticket


@router.put("/{ticket_id}", response_model=schemas.TicketUpdateResponse)
def update_ticket(ticket_id: str, update: schemas.TicketUpdate, db: Session = Depends(get_db)):
    if update.status and update.status not in schemas.VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {schemas.VALID_STATUSES}")

    if update.priority and update.priority not in schemas.VALID_PRIORITIES:
        raise HTTPException(status_code=400, detail=f"Invalid priority. Must be one of {schemas.VALID_PRIORITIES}")

    db_ticket = crud.update_ticket(db, ticket_id, update)
    if not db_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")

    return {"success": True, "updated_at": db_ticket.updated_at}