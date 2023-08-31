import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import Analytics from "./Analytics";
import SideBar from "./Sidebar";
import Search from "./CountrySearchBar";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";

import { Box } from "@mui/material";

const Home = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const { user } = useAuthContext();
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  console.log("user: ", user);

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        height: "100vh",
        overflowY: "hidden",
      }}>
      <SideBar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: "inherit",
          flexDirection: "column",
        }}>
        <Search />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "10px",
            margin: "15px",
          }}>
          <CountriesList
            visitedCountries={visitedCountries}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
          />
          <WorldMap
            visitedCountries={visitedCountries}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
