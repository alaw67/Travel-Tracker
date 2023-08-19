import React from "react";
import WorldMap from "./WorldMap";
import Analytics from "./Analytics";
import SideBar from "./Sidebar";
import Search from "./CountrySearchBar";
import CountriesList from "./CountriesList";

import { Box } from "@mui/material";

const Home = () => {
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
          <CountriesList />
          <WorldMap />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
