import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ThreatFeed } from "../types";
import { threatService } from "../services/threatService";

const Feeds: React.FC = () => {
  const [feeds, setFeeds] = useState<ThreatFeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = useState<ThreatFeed | null>(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const feedsData = await threatService.getFeeds();
      setFeeds(feedsData);
      setError(null);
    } catch (err) {
      setError("Failed to load threat feeds");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (feed: ThreatFeed) => {
    setSelectedFeed(feed);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeed(null);
  };

  const handleRefreshFeed = async (feedId: string) => {
    // In a real app, this would call an API to refresh the feed
    console.log(`Refreshing feed ${feedId}`);
    // After refresh, fetch feeds again
    await fetchFeeds();
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
        <Typography variant="h4">Threat Feeds</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add New Feed
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <MuiGrid container spacing={3}>
        {feeds.length === 0 && !loading ? (
          <MuiGrid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1">
                No threat feeds configured. Click "Add New Feed" to get started.
              </Typography>
            </Paper>
          </MuiGrid>
        ) : (
          // This is just placeholder data since we don't have real feeds yet
          [1, 2, 3, 4, 5].map((index) => (
            <MuiGrid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {index === 1 && "MISP Feed"}
                    {index === 2 && "AlienVault OTX"}
                    {index === 3 && "Recorded Future"}
                    {index === 4 && "VirusTotal"}
                    {index === 5 && "AbuseIPDB"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Last Updated: {new Date().toLocaleString()}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Chip
                      label={index % 2 === 0 ? "Active" : "Inactive"}
                      color={index % 2 === 0 ? "success" : "error"}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${Math.floor(Math.random() * 10000)} indicators`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {index === 1 &&
                      "Community-driven threat intelligence sharing platform."}
                    {index === 2 &&
                      "Open Threat Exchange - crowd-sourced threat data."}
                    {index === 3 &&
                      "Machine learning-based threat intelligence."}
                    {index === 4 &&
                      "File and URL analysis for malware detection."}
                    {index === 5 && "IP address reputation and abuse reports."}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() =>
                      handleOpenDialog({
                        id: `feed-${index}`,
                        name:
                          index === 1
                            ? "MISP Feed"
                            : index === 2
                            ? "AlienVault OTX"
                            : index === 3
                            ? "Recorded Future"
                            : index === 4
                            ? "VirusTotal"
                            : "AbuseIPDB",
                        source: "Example Source",
                        description: "Example description",
                        lastUpdated: new Date().toISOString(),
                        indicators: [],
                      })
                    }
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleRefreshFeed(`feed-${index}`)}
                  >
                    Refresh
                  </Button>
                </CardActions>
              </Card>
            </MuiGrid>
          ))
        )}
      </MuiGrid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedFeed?.name} Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Source: {selectedFeed?.source}</DialogContentText>
          <DialogContentText>
            Last Updated:{" "}
            {selectedFeed?.lastUpdated
              ? new Date(selectedFeed.lastUpdated).toLocaleString()
              : "N/A"}
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            {selectedFeed?.description}
          </DialogContentText>

          <Typography variant="subtitle2" gutterBottom>
            Configuration
          </Typography>

          <TextField
            margin="dense"
            label="API URL"
            type="text"
            fullWidth
            variant="outlined"
            value="https://example.com/api/feed"
            disabled
          />

          <TextField
            margin="dense"
            label="Update Interval"
            type="text"
            fullWidth
            variant="outlined"
            value="Every 6 hours"
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button color="primary">Edit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feeds;
