from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Optional
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
    description: Optional[str] = None

class SearchFilters(BaseModel):
    type: Optional[str] = None
    source: Optional[str] = None
    confidence: Optional[float] = None
    fromDate: Optional[str] = None
    toDate: Optional[str] = None
    tags: Optional[List[str]] = None
    searchTerm: Optional[str] = None

# Mock data
mock_indicators = [
    {
        "id": "indicator-1",
        "type": "IP",
        "value": "192.168.1.1",
        "source": "MISP",
        "confidence": 0.8,
        "timestamp": datetime.now().isoformat(),
        "tags": ["malware", "c2"],
        "description": "Command and control server"
    },
    {
        "id": "indicator-2",
        "type": "Domain",
        "value": "example.com",
        "source": "OTX",
        "confidence": 0.9,
        "timestamp": datetime.now().isoformat(),
        "tags": ["phishing"],
        "description": "Phishing domain"
    },
    {
        "id": "indicator-3",
        "type": "Hash",
        "value": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
        "source": "VirusTotal",
        "confidence": 0.95,
        "timestamp": datetime.now().isoformat(),
        "tags": ["ransomware"],
        "description": "Ransomware hash"
    }
]

# Routes
@router.post("/search", response_model=List[ThreatIndicator])
async def search_indicators(filters: SearchFilters = Body(...), current_user: User = Depends(get_current_user)):
    # In a real app, this would query a database with the provided filters
    # For this example, we'll do a simple filtering on the mock data
    
    results = mock_indicators.copy()
    
    if filters.type:
        results = [i for i in results if i["type"] == filters.type]
    
    if filters.source:
        results = [i for i in results if i["source"] == filters.source]
    
    if filters.confidence:
        results = [i for i in results if i["confidence"] >= filters.confidence]
    
    if filters.tags and len(filters.tags) > 0:
        results = [i for i in results if any(tag in i["tags"] for tag in filters.tags)]
    
    if filters.searchTerm:
        search_term = filters.searchTerm.lower()
        results = [i for i in results if (
            search_term in i["value"].lower() or 
            search_term in i["description"].lower() if i["description"] else False
        )]
    
    return results

@router.get("/{indicator_id}", response_model=ThreatIndicator)
async def get_indicator(indicator_id: str, current_user: User = Depends(get_current_user)):
    for indicator in mock_indicators:
        if indicator["id"] == indicator_id:
            return indicator
    raise HTTPException(status_code=404, detail="Indicator not found")

@router.get("/{indicator_id}/related", response_model=List[ThreatIndicator])
async def get_related_indicators(indicator_id: str, current_user: User = Depends(get_current_user)):
    # In a real app, this would find related indicators based on some criteria
    # For this example, we'll just return a couple of other indicators
    
    target_indicator = None
    for indicator in mock_indicators:
        if indicator["id"] == indicator_id:
            target_indicator = indicator
            break
    
    if not target_indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    
    # Return indicators with the same tags
    related = []
    for indicator in mock_indicators:
        if indicator["id"] != indicator_id:
            # Check if any tags match
            if any(tag in indicator["tags"] for tag in target_indicator["tags"]):
                related.append(indicator)
    
    return related