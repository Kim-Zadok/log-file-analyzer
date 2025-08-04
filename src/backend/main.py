from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, feeds, indicators, reports, visualization

app = FastAPI(
    title="Threat Intelligence Platform API",
    description="API for the Threat Intelligence Platform",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(feeds.router, prefix="/api/feeds", tags=["Threat Feeds"])
app.include_router(indicators.router, prefix="/api/indicators", tags=["Threat Indicators"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(visualization.router, prefix="/api/visualization", tags=["Visualization"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Threat Intelligence Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)