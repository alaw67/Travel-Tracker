import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import { Box } from "@mui/material";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";
import { RemoveConfirmationModal } from "./RemoveConfirmationModal";
import { FollowingList } from "./FollowingList";
import { useNavigate } from "react-router-dom";
import { getFollowing } from "../utilities/getfollowing";
import CountryPage from "./CountryPage";
import ToolBar from "./Toolbar";
import VisitPage from "./VisitPage";
import { unfollowUser } from "../utilities/unfollow";
import { removeCountry } from "../utilities/removeCountry";

type FollowedUser = {
  firstName: string;
  lastName: string;
  visitedCountries: [string];
  _id: string;
};

type Follow = {
  _id: string;
  follower: string;
  following: FollowedUser;
};

const Home = () => {
  console.log("rendering home");

  const { user } = useAuthContext();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  const [visitedCountries, setVisitedCountries] = useState<[string]>([""]);
  const [isRemovingCountry, setIsRemovingCountry] = useState<boolean>(false);
  const [isUnfollowingUser, setIsUnfollowingUser] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<string>("");
  const [countryToRemove, setCountryToRemove] = useState<string>("");
  const [focusedCountry, setFocusedCountry] = useState<string>("");
  const [listToShow, setListToShow] = useState<string>("countries");
  const [userToVisit, setUserToVisit] = useState<any>({});
  const [pageToRender, setPageToRender] = useState<string>("worldMap");
  const [followingUsers, setFollowingUsers] = useState<Follow[]>([]);

  console.log("user: ", user);

  const fetchFollowing = async () => {
    console.log("fetching following");
    try {
      const res = await getFollowing(user.id, user.token);
      console.log("res:", res);
      setFollowingUsers(res);
    } catch (err) {
      console.error(err);
    }
  };

  const removeVisitedCountry = async () => {
    try {
      const res = await removeCountry(user.token, countryToRemove);
      console.log("visited countries res: ", res);
      setVisitedCountries(res.visitedCountries);
    } catch (err) {
      console.error(err);
    }
  };

  const unfollow = async () => {
    try {
      await unfollowUser(user.id, userToRemove, user.token);
      fetchFollowing();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
        console.log("response to get countries failed");
        navigate("/login");
      } else {
        const countries = await countriesResponse.json();
        console.log("countries: ", countries);
        setVisitedCountries(countries.visitedCountries);
      }
    };
    console.log("token: ", user?.token);
    if (user?.token) {
      getVisitedCountries();
      fetchFollowing();
    }
  }, [user]);

  const renderPage = () => {
    switch (pageToRender) {
      case "worldMap":
        return (
          <Box sx={{ width: "100%" }}>
            <WorldMap visitedCountries={visitedCountries} height={"90vh"} />
          </Box>
        );
      case "visitPage":
        return (
          <VisitPage
            visitingUser={userToVisit}
            setPageToRender={setPageToRender}
            fetchFollowing={fetchFollowing}
          />
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
          setUserToVisit={setUserToVisit}
          setPageToRender={setPageToRender}
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
                  setIsModalOpen={setIsRemovingCountry}
                  setCountryToRemove={setCountryToRemove}
                  setPageToRender={setPageToRender}
                  setFocusedCountry={setFocusedCountry}
                />
              ) : (
                <FollowingList
                  setUserToRemove={setUserToRemove}
                  setUserToVisit={setUserToVisit}
                  setPageToRender={setPageToRender}
                  followingUsers={followingUsers}
                  setIsUnfollowingUser={setIsUnfollowingUser}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {isRemovingCountry && (
        <RemoveConfirmationModal
          item={countryToRemove}
          remove={removeVisitedCountry}
          setIsModalOpen={setIsRemovingCountry}
        />
      )}
      {isUnfollowingUser && (
        <RemoveConfirmationModal
          item={userToRemove}
          remove={unfollow}
          setIsModalOpen={setIsUnfollowingUser}
        />
      )}
    </Box>
  );
};

export default Home;
