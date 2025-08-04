import api from "./api";
import { Report } from "../types";

export const reportService = {
  // Get all reports
  getReports: async (): Promise<Report[]> => {
    const response = await api.get("/reports");
    return response.data;
  },

  // Get a specific report by ID
  getReportById: async (id: string): Promise<Report> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Create a new report
  createReport: async (
    report: Omit<Report, "id" | "createdAt">
  ): Promise<Report> => {
    const response = await api.post("/reports", report);
    return response.data;
  },

  // Update an existing report
  updateReport: async (
    id: string,
    report: Partial<Report>
  ): Promise<Report> => {
    const response = await api.put(`/reports/${id}`, report);
    return response.data;
  },

  // Delete a report
  deleteReport: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  // Export a report in specified format
  exportReport: async (
    id: string,
    format: "pdf" | "csv" | "json"
  ): Promise<Blob> => {
    const response = await api.get(`/reports/${id}/export?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
