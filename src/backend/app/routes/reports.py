from fastapi import APIRouter, Depends, HTTPException, Query, Response
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.routes.auth import get_current_user, User

router = APIRouter()

# Models
class Report(BaseModel):
    id: str
    name: str
    createdAt: str
    createdBy: str
    description: str
    content: str
    format: str

class CreateReportRequest(BaseModel):
    name: str
    description: str
    format: str
    content: str
    createdBy: str

# Mock data
mock_reports = [
    {
        "id": "report-1",
        "name": "Monthly Threat Summary",
        "createdAt": datetime.now().isoformat(),
        "createdBy": "admin",
        "description": "Summary of threats detected in the past month",
        "content": "This is the report content",
        "format": "pdf"
    },
    {
        "id": "report-2",
        "name": "Critical Vulnerabilities Report",
        "createdAt": datetime.now().isoformat(),
        "createdBy": "analyst",
        "description": "List of critical vulnerabilities requiring immediate attention",
        "content": "This is the report content",
        "format": "csv"
    },
    {
        "id": "report-3",
        "name": "Malware Analysis",
        "createdAt": datetime.now().isoformat(),
        "createdBy": "admin",
        "description": "Analysis of recent malware samples and their behaviors",
        "content": "This is the report content",
        "format": "json"
    }
]

# Routes
@router.get("/", response_model=List[Report])
async def get_reports(current_user: User = Depends(get_current_user)):
    return mock_reports

@router.get("/{report_id}", response_model=Report)
async def get_report(report_id: str, current_user: User = Depends(get_current_user)):
    for report in mock_reports:
        if report["id"] == report_id:
            return report
    raise HTTPException(status_code=404, detail="Report not found")

@router.post("/", response_model=Report)
async def create_report(report: CreateReportRequest, current_user: User = Depends(get_current_user)):
    # In a real app, you would save to a database
    new_report = {
        "id": f"report-{len(mock_reports) + 1}",
        "name": report.name,
        "createdAt": datetime.now().isoformat(),
        "createdBy": report.createdBy,
        "description": report.description,
        "content": report.content,
        "format": report.format
    }
    
    mock_reports.append(new_report)
    return new_report

@router.put("/{report_id}", response_model=Report)
async def update_report(report_id: str, report: Report, current_user: User = Depends(get_current_user)):
    for i, existing_report in enumerate(mock_reports):
        if existing_report["id"] == report_id:
            # Check if the user is allowed to update this report
            if current_user.role != "admin" and existing_report["createdBy"] != current_user.username:
                raise HTTPException(status_code=403, detail="Not authorized to update this report")
            
            # Update report
            mock_reports[i] = report.dict()
            return report
    
    raise HTTPException(status_code=404, detail="Report not found")

@router.delete("/{report_id}")
async def delete_report(report_id: str, current_user: User = Depends(get_current_user)):
    for i, report in enumerate(mock_reports):
        if report["id"] == report_id:
            # Check if the user is allowed to delete this report
            if current_user.role != "admin" and report["createdBy"] != current_user.username:
                raise HTTPException(status_code=403, detail="Not authorized to delete this report")
            
            # Delete report
            del mock_reports[i]
            return {"message": "Report deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Report not found")

@router.get("/{report_id}/export")
async def export_report(
    report_id: str, 
    format: str = Query(..., enum=["pdf", "csv", "json"]),
    current_user: User = Depends(get_current_user)
):
    # Find the report
    report = None
    for r in mock_reports:
        if r["id"] == report_id:
            report = r
            break
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # In a real app, you would generate the report in the requested format
    # For this example, we'll just return a placeholder response
    
    content = f"This is the content of report {report_id} in {format} format"
    
    # Set the appropriate content type based on the format
    if format == "pdf":
        media_type = "application/pdf"
    elif format == "csv":
        media_type = "text/csv"
    else:  # json
        media_type = "application/json"
        content = '{"report": "' + report["name"] + '", "content": "' + report["content"] + '"}'
    
    return Response(content=content, media_type=media_type)