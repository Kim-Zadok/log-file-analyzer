import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid as MuiGrid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  // FormHelperText,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { ThreatIndicator, SearchFilters } from "../types";
import { threatService } from "../services/threatService";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const indicatorTypes = [
  "IP",
  "Domain",
  "URL",
  "Email",
  "Hash",
  "File",
  "Process",
  "Registry",
];

const sources = [
  "MISP",
  "OTX",
  "Recorded Future",
  "VirusTotal",
  "AbuseIPDB",
  "Internal",
];

const confidenceLevels = [
  { value: 0, label: "Any" },
  { value: 25, label: "Low (25+)" },
  { value: 50, label: "Medium (50+)" },
  { value: 75, label: "High (75+)" },
  { value: 90, label: "Very High (90+)" },
];

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<SearchFilters>({
    type: undefined,
    source: undefined,
    confidence: undefined,
    fromDate: undefined,
    toDate: undefined,
    tags: [],
  });
  const [results, setResults] = useState<ThreatIndicator[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setFilters({
      ...filters,
      type: event.target.value,
    });
  };

  const handleSourceChange = (event: SelectChangeEvent<string>) => {
    setFilters({
      ...filters,
      source: event.target.value,
    });
  };

  const handleConfidenceChange = (event: SelectChangeEvent<number>) => {
    setFilters({
      ...filters,
      confidence: event.target.value as number,
    });
  };

  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setFilters({
      ...filters,
      tags: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add search term to filters if provided
      const searchFilters = searchTerm ? { ...filters, searchTerm } : filters;

      const searchResults = await threatService.searchIndicators(searchFilters);
      setResults(searchResults);
    } catch (err) {
      setError("Failed to perform search");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search Threat Indicators
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <MuiGrid container spacing={3}>
          <MuiGrid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Search Term"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter IP, domain, hash, etc."
            />
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="type-select-label">Indicator Type</InputLabel>
              <Select
                labelId="type-select-label"
                value={filters.type || ""}
                label="Indicator Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {indicatorTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="source-select-label">Source</InputLabel>
              <Select
                labelId="source-select-label"
                value={filters.source || ""}
                label="Source"
                onChange={handleSourceChange}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {sources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="confidence-select-label">Confidence</InputLabel>
              <Select
                labelId="confidence-select-label"
                value={filters.confidence || 0}
                label="Confidence"
                onChange={handleConfidenceChange}
              >
                {confidenceLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="tags-select-label">Tags</InputLabel>
              <Select
                labelId="tags-select-label"
                multiple
                value={filters.tags || []}
                onChange={handleTagsChange}
                input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                <MenuItem value="malware">Malware</MenuItem>
                <MenuItem value="phishing">Phishing</MenuItem>
                <MenuItem value="ransomware">Ransomware</MenuItem>
                <MenuItem value="apt">APT</MenuItem>
                <MenuItem value="botnet">Botnet</MenuItem>
              </Select>
            </FormControl>
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={filters.fromDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />
          </MuiGrid>

          <MuiGrid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={filters.toDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />
          </MuiGrid>

          <MuiGrid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </MuiGrid>
        </MuiGrid>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Results
        </Typography>

        {results.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No results found. Try adjusting your search criteria.
          </Typography>
        ) : (
          <Box>
            {/* Search results would be displayed here */}
            <Typography>
              {results.length} results found. Table implementation will be added
              here.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Search;
