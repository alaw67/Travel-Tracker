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
  visitedCountries: string[];
  setIsModalOpen: (isOpen: boolean) => void;
  setIsMapOpen: (isOpen: boolean) => void;
  setCountryToRemove: (country: string) => void;
  user: UserState;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const CountryItem = ({ countryName }: { countryName: string }) => {
    var countryCode: string =
      countryCodes[countryName as keyof typeof countryCodes];
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F6FCFF",
          width: "95%",
          height: "55px",
          marginLeft: "25px",
          marginTop: "7px",
          borderRadius: "50px 15px 15px 50px",
          boxShadow: "0px 3px 5px 1px rgba(0, 0, 0, 0.2)",
        }}>
        <CircleFlag countryCode={countryCode} height="55" />
        <Typography sx={{ marginLeft: "30px" }} variant="subtitle1">
          {countryName}
        </Typography>
        <Box
          onClick={() => {
            setIsModalOpen(true);
            setCountryToRemove(countryName);
            setIsModalOpen(true);
          }}
          sx={{ marginLeft: "auto", marginRight: "10px" }}>
          <CloseIcon
            sx={{
              cursor: "pointer",
              fontSize: "15px",
              color: "#c20000",
            }}
          />
        </Box>
      </Box>
    );
  };
  if (open) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #d8dfe3",
          height:
            80 +
            (visitedCountries.length > 8 ? 8 : visitedCountries.length) * 62 +
            "px",
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
          <Box
            onClick={() => {
              setOpen(false);
              setIsMapOpen(true);
            }}
            sx={{
              marginRight: "30px",
              marginTop: "14px",
              color: "#6C6C6C",
              cursor: "pointer",
            }}>
            <ExpandLessIcon />
          </Box>
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
          border: "1px solid #d8dfe3",
        }}>
        <Typography
          variant="h6"
          sx={{
            marginLeft: "30px",
            color: "#6C6C6C",
          }}>
          {`${visitedCountries.length} ${
            visitedCountries === null
              ? ""
              : visitedCountries.length === 1
              ? "Visited Country"
              : "Visited Countries"
          }`}
        </Typography>
        <Box
          onClick={() => {
            setOpen(true);
            setIsMapOpen(false);
          }}
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
