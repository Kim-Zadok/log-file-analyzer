export interface ThreatIndicator {
  id: string;
  type: string;
  value: string;
  source: string;
  confidence: number;
  timestamp: string;
  tags: string[];
  description?: string;
}

export interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  description: string;
  lastUpdated: string;
  indicators: ThreatIndicator[];
}

export interface SearchFilters {
  type?: string;
  source?: string;
  confidence?: number;
  fromDate?: string;
  toDate?: string;
  tags?: string[];
}

export interface VisualizationData {
  timelineData?: {
    date: string;
    count: number;
  }[];
  sourceDistribution?: {
    source: string;
    count: number;
  }[];
  typeDistribution?: {
    type: string;
    count: number;
  }[];
}

export interface Report {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  description: string;
  content: string;
  format: "pdf" | "csv" | "json";
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
}
