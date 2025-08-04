from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from pydantic import BaseModel
from app.routes.auth import get_current_user, User

router = APIRouter()

# Models
class ThreatIndicator(BaseModel):
    id: str
    type: str
    value: str
    source: str
    confidence: float
    timestamp: str
    tags: List[str]
    description: str | None = None

class ThreatFeed(BaseModel):
    id: str
    name: str
    source: str
    description: str
    lastUpdated: str
    indicators: List[ThreatIndicator] = []

# Mock data
mock_feeds = [
    {
        "id": "feed-1",
        "name": "MISP Feed",
        "source": "MISP",
        "description": "Community-driven threat intelligence sharing platform.",
        "lastUpdated": datetime.now().isoformat(),
        "indicators": [
            {
                "id": "indicator-1",
                "type": "IP",
                "value": "192.168.1.1",
                "source": "MISP",
                "confidence": 0.8,
                "timestamp": datetime.now().isoformat(),
                "tags": ["malware", "c2"],
                "description": "Command and control server"
            }
        ]
    },
    {
        "id": "feed-2",
        "name": "AlienVault OTX",
        "source": "OTX",
        "description": "Open Threat Exchange - crowd-sourced threat data.",
        "lastUpdated": datetime.now().isoformat(),
        "indicators": []
    },
    {
        "id": "feed-3",
        "name": "Recorded Future",
        "source": "Recorded Future",
        "description": "Machine learning-based threat intelligence.",
        "lastUpdated": datetime.now().isoformat(),
        "indicators": []
    }
]

# Routes
@router.get("/", response_model=List[ThreatFeed])
async def get_feeds(current_user: User = Depends(get_current_user)):
    return mock_feeds

@router.get("/{feed_id}", response_model=ThreatFeed)
async def get_feed(feed_id: str, current_user: User = Depends(get_current_user)):
    for feed in mock_feeds:
        if feed["id"] == feed_id:
            return feed
    raise HTTPException(status_code=404, detail="Feed not found")

@router.post("/", response_model=ThreatFeed)
async def create_feed(feed: ThreatFeed, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to create feeds")
    
    # In a real app, you would save to a database
    mock_feeds.append(feed.dict())
    return feed

@router.put("/{feed_id}", response_model=ThreatFeed)
async def update_feed(feed_id: str, feed: ThreatFeed, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update feeds")
    
    for i, existing_feed in enumerate(mock_feeds):
        if existing_feed["id"] == feed_id:
            # Update feed
            mock_feeds[i] = feed.dict()
            return feed
    
    raise HTTPException(status_code=404, detail="Feed not found")

@router.delete("/{feed_id}")
async def delete_feed(feed_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete feeds")
    
    for i, feed in enumerate(mock_feeds):
        if feed["id"] == feed_id:
            # Delete feed
            del mock_feeds[i]
            return {"message": "Feed deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Feed not found")