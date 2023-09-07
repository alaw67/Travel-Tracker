import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import { Button, Typography } from "@mui/material";
import Analytics from "./Analytics";
import SideBar from "./Sidebar";
import Search from "./CountrySearchBar";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";
import { UserState } from "../context/AuthContext";

import { Box } from "@mui/material";

const Home = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const { user } = useAuthContext();
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countryToRemove, setCountryToRemove] = useState<string>("");
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

  const RemoveConfirmationModal = ({ country }: { country: string }) => {
    const removeVisitedCountry = async (country: string) => {
      console.log("token...", user?.token);
      const response = await fetch("/api/users/countries/delete", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ country: country }),
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

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: "0px",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "500px",
            height: "200px",
            backgroundColor: "white",
            borderRadius: "10px",
          }}>
          <Box>
            <Typography
              sx={{
                textAlign: "center",
                marginX: "20px",
                marginBottom: "15px",
              }}
              variant="h6">
              {`Are you sure you want to remove ${country} from your visited countries?`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#de362a",
                  color: "white",
                  "&:hover": { backgroundColor: "#cf3227" },
                }}
                onClick={() => {
                  removeVisitedCountry(countryToRemove);
                  setIsModalOpen(false);
                }}>
                Remove
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsModalOpen(false);
                }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        height: "100vh",
        overflowY: "hidden",
      }}>
      <SideBar user={user} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: "inherit",
          flexDirection: "column",
        }}>
        <Search user={user} setVisitedCountries={setVisitedCountries} />
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
            setIsModalOpen={setIsModalOpen}
            setCountryToRemove={setCountryToRemove}
            setIsMapOpen={setIsMapOpen}
            user={user}
          />
          <WorldMap
            visitedCountries={visitedCountries}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
          />
        </Box>
      </Box>
      {isModalOpen && <RemoveConfirmationModal country={countryToRemove} />}
    </Box>
  );
};

export default Home;
