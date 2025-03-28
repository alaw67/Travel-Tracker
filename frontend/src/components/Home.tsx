import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import { Box } from "@mui/material";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";
import { RemoveConfirmationModal } from "./RemoveConfirmationModal";
import { FollowingList } from "./FollowingList";
import { useNavigate } from "react-router-dom";
import CountryPage from "./CountryPage";
import ToolBar from "./Toolbar";
import VisitPage from "./VisitPage";

const Home = () => {
  console.log("rendering home");

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
  const [listToShow, setListToShow] = useState<string>("countries");
  const [me, setMe] = useState<any>({});
  const [visiting, setVisiting] = useState<boolean>(false);
  const [userToVisit, setUserToVisit] = useState<any>({});
  const [pageToRender, setPageToRender] = useState<string>("worldMap");

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

  const renderPage = () => {
    switch (pageToRender) {
      case "worldMap":
        return <WorldMap visitedCountries={visitedCountries} />;
      case "visitPage":
        return (
          <VisitPage user={userToVisit} setPageToRender={setPageToRender} />
        );
      case "countryPage":
        return (
          <CountryPage
            countryName={focusedCountry}
            setPageToRender={setPageToRender}
          />
        );
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
        <ToolBar
          setVisitedCountries={setVisitedCountries}
          setListToShow={setListToShow}
          listToShow={listToShow}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            margin: "10px",
          }}>
          <Box
            sx={{
              display: "inline-flex",
              position: "relative",
              gap: "10px",
            }}>
            {renderPage()}
            <Box sx={{ width: "20%" }}>
              {listToShow === "countries" ? (
                <CountriesList
                  visitedCountries={visitedCountries}
                  setIsModalOpen={setIsCountriesModalOpen}
                  setCountryToRemove={setCountryToRemove}
                  setPageToRender={setPageToRender}
                  setFocusedCountry={setFocusedCountry}
                />
              ) : (
                <FollowingList
                  following={me.following}
                  setUserToRemove={setUserToRemove}
                  userToken={user.token}
                  setUserToVisit={setUserToVisit}
                  setVisiting={setVisiting}
                  setPageToRender={setPageToRender}
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
