import { useState, useEffect, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoData from "../data/geoData.json";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import Sidebar from "./Sidebar";

const WorldMap = () => {
  const { user } = useAuthContext();
  console.log("user: ", user);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [visitedCountries, setVisitedCountries] = useState([]);

  useEffect(() => {
    const getVisitedCountries = async () => {
      console.log("token...", user?.token);
      const response = await fetch("/api/users/countries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("response: ", response);

      if (!response.ok) {
        console.log("response failed");
      } else {
        const countries = await response.json();
        console.log("countries: ", countries);
        setVisitedCountries(countries.visitedCountries);
      }
    };
    console.log("token: ", user?.token);
    if (user?.token) {
      console.log("getting countries");
      getVisitedCountries();
    }
  }, [user]);

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
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{
        rotate: [-20, 0, 0],
        scale: 180,
      }}
      style={{
        width: "100%",
        height: "700px",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
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
                  selected: {
                    fill: "#6B8E23",
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
