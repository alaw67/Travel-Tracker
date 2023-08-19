import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CountriesList = () => {
  const [open, setOpen] = useState<Boolean>(false);
  if (open) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "300px",
          width: "100%",
          justifyContent: "space-between",
          backgroundColor: "#f2f5f7",
          borderRadius: "10px",
        }}>
        <Typography
          variant="h6"
          sx={{ marginLeft: "30px", marginTop: "14px", color: "#6C6C6C" }}>
          List of Visited Countries
        </Typography>
        <Box
          onClick={() => setOpen(false)}
          sx={{
            marginRight: "30px",
            marginTop: "14px",
            color: "#6C6C6C",
            cursor: "pointer",
          }}>
          <ExpandLessIcon />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          height: "60px",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f2f5f7",
          borderRadius: "10px",
        }}>
        <Typography
          variant="h6"
          sx={{
            marginLeft: "30px",
            color: "#6C6C6C",
          }}>
          List of Visited Countries
        </Typography>
        <Box
          onClick={() => setOpen(true)}
          sx={{
            marginRight: "30px",
            color: "#6C6C6C",
            cursor: "pointer",
          }}>
          <ExpandMoreIcon />
        </Box>
      </Box>
    );
  }
};

export default CountriesList;
