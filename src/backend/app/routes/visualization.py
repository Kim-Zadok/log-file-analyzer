from fastapi import APIRouter, Depends, Body
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.routes.auth import get_current_user, User

router = APIRouter()

# Models
class TimelineDataPoint(BaseModel):
    date: str
    count: int

class SourceDistribution(BaseModel):
    source: str
    count: int

class TypeDistribution(BaseModel):
    type: str
    count: int

class VisualizationData(BaseModel):
    timelineData: Optional[List[TimelineDataPoint]] = None
    sourceDistribution: Optional[List[SourceDistribution]] = None
    typeDistribution: Optional[List[TypeDistribution]] = None

class SearchFilters(BaseModel):
    type: Optional[str] = None
    source: Optional[str] = None
    confidence: Optional[float] = None
    fromDate: Optional[str] = None
    toDate: Optional[str] = None
    tags: Optional[List[str]] = None

# Routes
@router.post("/", response_model=VisualizationData)
async def get_visualization_data(filters: SearchFilters = Body(...), current_user: User = Depends(get_current_user)):
    # In a real app, this would query a database with the provided filters
    # and generate visualization data based on the results
    
    # For this example, we'll generate some mock data
    
    # Generate timeline data for the last 7 days
    timeline_data = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        count = 10 + i * 5  # Some random count
        timeline_data.append({
            "date": date,
            "count": count
        })
    
    # Generate source distribution data
    source_distribution = [
        {"source": "MISP", "count": 45},
        {"source": "OTX", "count": 32},
        {"source": "Recorded Future", "count": 28},
        {"source": "VirusTotal", "count": 18},
        {"source": "AbuseIPDB", "count": 12}
    ]
    
    # Generate type distribution data
    type_distribution = [
        {"type": "IP", "count": 56},
        {"type": "Domain", "count": 42},
        {"type": "URL", "count": 35},
        {"type": "Hash", "count": 28},
        {"type": "Email", "count": 14}
    ]
    
    return {
        "timelineData": timeline_data,
        "sourceDistribution": source_distribution,
        "typeDistribution": type_distribution
    }