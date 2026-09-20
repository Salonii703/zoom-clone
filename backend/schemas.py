"""
Pydantic schemas — request/response validation models.
"""
from typing import Optional, List
from pydantic import BaseModel


class ScheduleMeetingRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    date: str       # "2026-09-10"
    time: str       # "14:30"
    duration_minutes: int = 30
    host_name: Optional[str] = "Saloni"


class InstantMeetingRequest(BaseModel):
    host_name: Optional[str] = "Saloni"
    title: Optional[str] = "Instant Meeting"


class JoinMeetingRequest(BaseModel):
    name: str


class ParticipantResponse(BaseModel):
    id: int
    name: str
    joined_at: str


class MeetingResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    host_name: str
    type: str
    status: str
    scheduled_at: Optional[str] = None
    duration_minutes: int
    invite_link: Optional[str] = None
    created_at: str
    participants: List[ParticipantResponse] = []
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: str