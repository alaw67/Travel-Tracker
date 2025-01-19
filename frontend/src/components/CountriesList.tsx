import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import countryCodes from "../data/countryCodes";
import { CircleFlag } from "react-circle-flags";
import CloseIcon from "@mui/icons-material/Close";
import { UserState } from "../context/AuthContext";

const CountriesList = ({
  visitedCountries,
  setIsModalOpen,
  setIsMapOpen,
  setCountryToRemove,
  user,
}: {
  visitedCountries: [string];
  setIsModalOpen: (isOpen: boolean) => void;
  setIsMapOpen: (isOpen: boolean) => void;
  setCountryToRemove: (country: string) => void;
  user: UserState;
}) => {
  const [hoveredCountry, setHoveredCountry] = useState("");

  const CountryItem = ({ countryName }: { countryName: string }) => {
    var countryCode: string =
      countryCodes[countryName as keyof typeof countryCodes];
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F6FCFF",
          width: "100%",
          height: "40px",
          marginTop: "7px",
          borderRadius: "50px 15px 15px 50px",
          boxShadow: "0px 3px 5px 1px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={() => {
          setHoveredCountry(countryName);
        }}
        onMouseLeave={() => {
          setHoveredCountry("");
        }}>
        <CircleFlag countryCode={countryCode} height="40" />
        <Typography sx={{ marginLeft: "30px" }} variant="body1">
          {countryName}
        </Typography>
        <Box
          onClick={() => {
            setIsModalOpen(true);
            setCountryToRemove(countryName);
            setIsModalOpen(true);
          }}
          sx={{ marginLeft: "auto", marginRight: "10px" }}>
          {hoveredCountry === countryName && (
            <CloseIcon
              sx={{
                cursor: "pointer",
                fontSize: "15px",
                color: "#c20000",
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // border: "1px solid #d8dfe3",
        height: "90vh",
        width: "100%",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
      }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ marginLeft: "30px", marginTop: "14px", color: "#6C6C6C" }}>
          {`${visitedCountries.length} ${
            visitedCountries === null
              ? ""
              : visitedCountries.length === 1
              ? "Visited Country"
              : "Visited Countries"
          }`}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "15px",
          paddingBottom: "20px",
          overflowY: "scroll",
        }}>
        {visitedCountries.map((country, i) => (
          <CountryItem key={i} countryName={country} />
        ))}
      </Box>
    </Box>
  );
};

export default CountriesList;
