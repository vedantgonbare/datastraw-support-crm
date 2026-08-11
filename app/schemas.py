from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


VALID_STATUSES = ("Open", "In Progress", "Closed")
VALID_PRIORITIES = ("Low", "Medium", "High", "Urgent")


class NoteOut(BaseModel):
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=300)
    description: str = Field(..., min_length=1)
    priority: Optional[str] = "Medium"


class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime


class TicketListItem(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


class TicketDetail(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteOut] = []

    class Config:
        from_attributes = True


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None


class TicketUpdateResponse(BaseModel):
    success: bool
    updated_at: datetime