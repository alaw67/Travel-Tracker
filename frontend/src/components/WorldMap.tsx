import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import geoData from "../data/geoData.json";

const WorldMap = ({ visitedCountries }: { visitedCountries: [string] }) => {
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

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{
        rotate: [-20, 0, 0],
        scale: 160,
      }}
      style={{
        width: "80%",
        height: "90vh",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
        // paddingTop: "15px",
        border: "1px solid #d8dfe3",
        marginBottom: "10px",
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
  );
};

export default WorldMap;
