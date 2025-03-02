import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import { Box, IconButton } from "@mui/material";
import Search from "./CountrySearchBar";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";
import { RemoveConfirmationModal } from "./RemoveConfirmationModal";
import { FollowingList } from "./FollowingList";
import { useNavigate } from "react-router-dom";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PeopleIcon from "@mui/icons-material/People";
import CountryPage from "./CountryPage";

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  const [visitedCountries, setVisitedCountries] = useState<[string]>([""]);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const [isCountriesModalOpen, setIsCountriesModalOpen] =
    useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<string>("");
  const [countryToRemove, setCountryToRemove] = useState<string>("");
  const [focusedCountry, setFocusedCountry] = useState<string>("");
  const [showCountriesList, setShowCountriesList] = useState<boolean>(true);
  const [me, setMe] = useState<any>({});

  console.log("user: ", user);

  useEffect(() => {
    const getMe = async () => {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.log("failed to get your user details");
      } else {
        const myUser = await response.json();
        console.log("myUser", myUser);
        setMe(myUser);
      }
    };
    const getVisitedCountries = async () => {
      const countriesResponse = await fetch("/api/users/countries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("response: ", countriesResponse);

      if (!countriesResponse.ok) {
        console.log("response failed");
      } else {
        const countries = await countriesResponse.json();
        console.log("countries: ", countries);
        setVisitedCountries(countries.visitedCountries);
      }
    };
    console.log("token: ", user?.token);
    if (user?.token) {
      getVisitedCountries();
      getMe();
    }
  }, [user]);

  const removeVisitedCountry = async (country: string): Promise<any> => {
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
        flexDirection: "row",
        height: "100vh",
        overflowY: "hidden",
      }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: "inherit",
          flexDirection: "column",
        }}>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            marginTop: "10px",
            alignItems: "center",
          }}>
          <Search setVisitedCountries={setVisitedCountries} />
          <Box
            sx={{
              display: "inline-flex",
              marginRight: "10px",
            }}>
            <IconButton
              onClick={() => {
                setShowCountriesList(!showCountriesList);
              }}>
              {showCountriesList ? <FlagRoundedIcon /> : <OutlinedFlagIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                setShowCountriesList(!showCountriesList);
              }}>
              {showCountriesList ? <PeopleOutlineIcon /> : <PeopleIcon />}
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            margin: "10px",
          }}>
          <Box
            sx={{
              // alignItems: "stretch",
              display: "inline-flex",
              position: "relative",
              gap: "10px",
            }}>
            {isMapOpen ? (
              <WorldMap visitedCountries={visitedCountries} />
            ) : (
              <CountryPage
                countryName={focusedCountry}
                setIsMapOpen={setIsMapOpen}
              />
            )}
            <Box sx={{ width: "20%" }}>
              {showCountriesList ? (
                <CountriesList
                  visitedCountries={visitedCountries}
                  setIsModalOpen={setIsCountriesModalOpen}
                  setCountryToRemove={setCountryToRemove}
                  setIsMapOpen={setIsMapOpen}
                  setFocusedCountry={setFocusedCountry}
                />
              ) : (
                <FollowingList
                  following={me.following}
                  setUserToRemove={setUserToRemove}
                  userToken={user.token}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {isCountriesModalOpen && (
        <RemoveConfirmationModal
          item={countryToRemove}
          remove={removeVisitedCountry}
          setIsModalOpen={setIsCountriesModalOpen}
        />
      )}
    </Box>
  );
};

export default Home;
