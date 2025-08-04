# Threat Intelligence Platform

A comprehensive platform for aggregating, analyzing, and visualizing security threat feeds to support SOC operations.

## Overview

The Threat Intelligence Platform aggregates and analyzes security threat feeds, enabling searching, correlation, and visualization of attack trends. Powering the proactive role of SOC teams, it supports comprehensive threat hunting and streamlined reporting.

## Features

- **Threat Feed Ingestion**: Automated collection from open-source and commercial feeds
- **IOC Search & Correlation**: Fast search across millions of indicators; links and patterns
- **Visualization**: Attack timelines, trend graphs, indicator linkage, and threat clusters
- **Automated Reports**: Customizable, exportable analysis for stakeholders
- **Export for Compliance**: Output relevant threat data for audits
- **Security**: OAuth2 authentication, HTTPS

## Tech Stack

- **Frontend**: React.js with TypeScript, Material UI, D3.js/Chart.js for data visualization
- **Backend**: Python with FastAPI
- **Database**: Elasticsearch for fast searches (to be implemented)
- **Authentication**: JWT-based authentication

## Project Structure

```
/
├── src/
│   ├── frontend/          # React frontend application
│   │   ├── public/        # Public assets
│   │   └── src/           # Source code
│   │       ├── components/  # Reusable components
│   │       ├── pages/       # Page components
│   │       ├── services/    # API services
│   │       ├── utils/       # Utility functions
│   │       ├── types/       # TypeScript type definitions
│   │       ├── contexts/    # React contexts
│   │       └── hooks/       # Custom React hooks
│   └── backend/           # FastAPI backend application
│       ├── app/           # Application code
│       │   └── routes/    # API routes
│       ├── models/        # Database models
│       ├── schemas/       # Pydantic schemas
│       ├── utils/         # Utility functions
│       └── config/        # Configuration
├── docs/                # Documentation
└── tests/               # Test suites
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd src/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. The application will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd src/backend
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Start the API server:

   ```
   uvicorn main:app --reload
   ```

5. The API will be available at http://localhost:8000

## API Documentation

Once the backend is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

For demo purposes, you can use the following credentials:

- Username: admin, Password: admin
- Username: analyst, Password: analyst

## Future Enhancements

- Integration with additional threat intelligence feeds
- Advanced correlation algorithms
- Machine learning for threat detection
- Real-time alerting
- Custom dashboards
- User management and role-based access control
