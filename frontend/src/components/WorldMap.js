import { useState, useEffect, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoData from "../data/geoData.json";
import { Box, Typography, TextField } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
  const handleCountryClick = (country) => {
    setVisitedCountries([...visitedCountries, country]);
    setSelectedCountry(country);
  };

  const handleCountryHover = (country) => {
    setSelectedCountry(country);
  };

  const handleCountryLeave = () => {
    setSelectedCountry(null);
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
        paddingTop: "20px",
        backgroundColor: "#2a354d",
      }}>
      {/* <TextField
        id="outlined-basic"
        label="Add a Country"
        variant="outlined"
        sx={{ alignContent: "center" }}
      /> */}
      {selectedCountry ? (
        <Typography variant="h5" textAlign="center" sx={{ color: "white" }}>
          {selectedCountry.properties.name}
        </Typography>
      ) : (
        <Typography variant="h5" textAlign="center" sx={{ color: "white" }}>
          nothing
        </Typography>
      )}
      <ComposableMap
        projectionConfig={{
          rotate: [-20, 0, 0],
          scale: 130,
        }}
        height={340}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                onMouseEnter={() => handleCountryHover(geo)}
                onMouseLeave={() => handleCountryLeave()}
                style={{
                  default: {
                    fill: visitedCountries.includes(geo) ? "green" : "white",
                    outline: "none",
                  },
                  hover: {
                    fill: "gray",
                    outline: "none",
                  },
                  selected: {
                    fill: "#6B8E23",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#6B8E23",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default WorldMap;
