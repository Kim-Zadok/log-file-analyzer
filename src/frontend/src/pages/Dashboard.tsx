import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { VisualizationData } from "../types";
import { threatService } from "../services/threatService";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] =
    useState<VisualizationData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await threatService.getVisualizationData({});
        setVisualizationData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading dashboard data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Threat Intelligence Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Indicators
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* Example value - replace with visualizationData logic if needed */}
              1,234
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              High Confidence Threats
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* Example value - replace with visualizationData logic if needed */}
              567
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Active Feeds
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* Example value - replace with visualizationData logic if needed */}
              12
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Threat Timeline
            </Typography>
            {/* Visualization placeholder */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Timeline chart will be implemented with D3.js or Chart.js
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Threat Sources
            </Typography>
            {/* Visualization placeholder */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Source distribution chart will be implemented with D3.js or
                Chart.js
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Indicators
            </Typography>
            {/* Table placeholder */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Table of recent indicators will be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
