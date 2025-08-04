import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Report } from "../types";
import { reportService } from "../services/reportService";

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [reportName, setReportName] = useState<string>("");
  const [reportDescription, setReportDescription] = useState<string>("");
  const [reportFormat, setReportFormat] = useState<"pdf" | "csv" | "json">(
    "pdf"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsData = await reportService.getReports();
      setReports(reportsData);
      setError(null);
    } catch (err) {
      setError("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    reportId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReportName("");
    setReportDescription("");
    setReportFormat("pdf");
  };

  const handleFormatChange = (
    event: SelectChangeEvent<"pdf" | "csv" | "json">
  ) => {
    setReportFormat(event.target.value as "pdf" | "csv" | "json");
  };

  const handleCreateReport = async () => {
    try {
      await reportService.createReport({
        name: reportName,
        description: reportDescription,
        format: reportFormat,
        content: "",
        createdBy: "Current User",
      });

      handleCloseDialog();
      await fetchReports();
    } catch (err) {
      console.error("Failed to create report", err);
      // Show error message to user
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportService.deleteReport(reportId);
      handleCloseMenu();
      await fetchReports();
    } catch (err) {
      console.error("Failed to delete report", err);
      // Show error message to user
    }
  };

  const handleExportReport = async (
    reportId: string,
    format: "pdf" | "csv" | "json"
  ) => {
    try {
      const blob = await reportService.exportReport(reportId, format);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      handleCloseMenu();
    } catch (err) {
      console.error("Failed to export report", err);
      // Show error message to user
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Report
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Format</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No reports found. Click "Create Report" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                // Placeholder data since we don't have real reports yet
                [1, 2, 3].map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {index === 1 && "Monthly Threat Summary"}
                      {index === 2 && "Critical Vulnerabilities Report"}
                      {index === 3 && "Malware Analysis"}
                    </TableCell>
                    <TableCell>
                      {index === 1 &&
                        "Summary of threats detected in the past month"}
                      {index === 2 &&
                        "List of critical vulnerabilities requiring immediate attention"}
                      {index === 3 &&
                        "Analysis of recent malware samples and their behaviors"}
                    </TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>
                      {index === 1 && "PDF"}
                      {index === 2 && "CSV"}
                      {index === 3 && "JSON"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        onClick={(e) => handleOpenMenu(e, `report-${index}`)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() =>
            selectedReportId && handleExportReport(selectedReportId, "pdf")
          }
        >
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Export as PDF
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedReportId && handleExportReport(selectedReportId, "csv")
          }
        >
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Export as CSV
        </MenuItem>
        <MenuItem>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedReportId && handleDeleteReport(selectedReportId)
          }
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Report Name"
            type="text"
            fullWidth
            variant="outlined"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel id="report-format-label">Format</InputLabel>
            <Select
              labelId="report-format-label"
              value={reportFormat}
              label="Format"
              onChange={handleFormatChange}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCreateReport}
            variant="contained"
            color="primary"
            disabled={!reportName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
