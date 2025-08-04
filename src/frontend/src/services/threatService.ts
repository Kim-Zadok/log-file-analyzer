import api from "./api";
import { ThreatFeed, ThreatIndicator, SearchFilters } from "../types";

export const threatService = {
  // Get all threat feeds
  getFeeds: async (): Promise<ThreatFeed[]> => {
    const response = await api.get("/feeds");
    return response.data;
  },

  // Get a specific feed by ID
  getFeedById: async (id: string): Promise<ThreatFeed> => {
    const response = await api.get(`/feeds/${id}`);
    return response.data;
  },

  // Search for indicators with filters
  searchIndicators: async (
    filters: SearchFilters
  ): Promise<ThreatIndicator[]> => {
    const response = await api.post("/indicators/search", filters);
    return response.data;
  },

  // Get indicator details by ID
  getIndicatorById: async (id: string): Promise<ThreatIndicator> => {
    const response = await api.get(`/indicators/${id}`);
    return response.data;
  },

  // Get related indicators
  getRelatedIndicators: async (id: string): Promise<ThreatIndicator[]> => {
    const response = await api.get(`/indicators/${id}/related`);
    return response.data;
  },

  // Get visualization data
  getVisualizationData: async (filters: SearchFilters) => {
    const response = await api.post("/visualization", filters);
    return response.data;
  },
};
