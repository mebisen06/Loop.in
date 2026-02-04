from fastapi import APIRouter
from datetime import datetime
from typing import List
from pydantic import BaseModel

router = APIRouter()

class NewsItem(BaseModel):
    id: int
    title: str
    date: str
    type: str # Academic, Event, Notice
    color: str

@router.get("/", response_model=List[NewsItem])
def get_campus_news():
    """
    Fetch real-time campus news and announcements.
    In a real app, this would query a 'News' table.
    """
    return [
        {
            "id": 1,
            "title": "Mid-Term Exam Schedule Released",
            "date": "Oct 15",
            "type": "Academic",
            "color": "bg-red-100 text-red-700"
        },
        {
            "id": 2,
            "title": "Guest Lecture: AI in Healthcare",
            "date": "Oct 18",
            "type": "Event",
            "color": "bg-blue-100 text-blue-700"
        },
        {
            "id": 3,
            "title": "Library Maintenance Downtime",
            "date": "Oct 20",
            "type": "Notice",
            "color": "bg-yellow-100 text-yellow-700"
        },
        {
            "id": 4,
            "title": "Hackathon Registration Open",
            "date": "Oct 22",
            "type": "Event",
            "color": "bg-purple-100 text-purple-700"
        }
    ]
