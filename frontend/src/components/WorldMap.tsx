import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import geoData from "../data/geoData.json";

const WorldMap = ({
  visitedCountries,
  isMapOpen,
  setIsMapOpen,
}: {
  visitedCountries: string[];
  isMapOpen: boolean;
  setIsMapOpen: (isOpen: boolean) => void;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCountryHover = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCountryLeave = () => {
    setSelectedCountry(null);
  };
  if (!isMapOpen) {
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
          {"World Map"}
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box sx={{ position: "relative" }}>
        {/* {selectedCountry ? (
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: "white", position: "absolute", top: "0px" }}>
            {selectedCountry}
          </Typography>
        ) : (
          <Typography variant="h5" textAlign="center" sx={{ color: "white" }}>
            nothing
          </Typography>
        )} */}
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            rotate: [-20, 0, 0],
            scale: 180,
          }}
          style={{
            width: "100%",
            height: "650px",
            backgroundColor: "#f2f5f7",
            borderRadius: "10px",
            paddingTop: "15px",
            border: "1px solid #d8dfe3",
          }}>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#c2d0db"
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => handleCountryHover(geo)}
                    onMouseLeave={() => handleCountryLeave()}
                    style={{
                      default: {
                        fill: visitedCountries.includes(geo.properties.name)
                          ? "#3388b0"
                          : "#e1e8ed",
                        outline: "none",
                      },
                      hover: {
                        fill: "white",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#3388b0",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Box>
    );
  }
};

export default WorldMap;
