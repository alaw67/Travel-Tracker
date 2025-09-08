import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import CountriesList from "./CountriesList";
import { useAuthContext } from "../hooks/useAuthContext";
import { RemoveConfirmationModal } from "./RemoveConfirmationModal";
import { FollowingList } from "./FollowingList";
import { useNavigate } from "react-router-dom";
import { getFollowing } from "../utilities/getfollowing";
import CountryPage from "./CountryPage";
import ToolBar from "./Toolbar";
import ProfileBanner from "./ProfileBanner";
import PageWrapper from "./PageWrapper";
import WorldMap from "./WorldMap";
import { unfollowUser } from "../utilities/unfollow";
import { followUser } from "../utilities/follow";
import { removeCountry } from "../utilities/removeCountry";

type FollowedUser = {
  firstName: string;
  lastName: string;
  visitedCountries: string[];
  _id: string;
};

type Follow = {
  _id: string;
  follower: string;
  following: FollowedUser;
};

const Home = () => {
  console.log("rendering home");

  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [visitedCountries, setVisitedCountries] = useState<[string]>([""]);
  const [isRemovingCountry, setIsRemovingCountry] = useState<boolean>(false);
  const [isUnfollowingUser, setIsUnfollowingUser] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<string>("");
  const [countryToRemove, setCountryToRemove] = useState<string>("");
  const [focusedCountry, setFocusedCountry] = useState<string>("");
  const [listToShow, setListToShow] = useState<string>("countries");
  const [curVisitingUser, setCurVisitingUser] = useState<any>({});
  const [pageToRender, setPageToRender] = useState<string>("visitPage");
  const [followingUsers, setFollowingUsers] = useState<Follow[]>([]);

  const [isFollowingUser, setIsFollowingUser] = useState<boolean | null>(null);

  const fetchFollowing = useCallback(async () => {
    console.log("fetching following");
    console.log("userrr", user);
    try {
      const res = await getFollowing(user.id, user.token);
      console.log("res:", res);
      setFollowingUsers(res);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const followUnfollow = async () => {
    if (isFollowingUser) {
      await unfollowUser(user.id, curVisitingUser._id, user.token);
    } else {
      await followUser(user.id, curVisitingUser._id, user.token);
    }
    setIsFollowingUser(!isFollowingUser);
    fetchFollowing();
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

  const renderPage = () => {
    switch (pageToRender) {
      case "visitPage":
        return (
          <WorldMap
            visitedCountries={
              Object.keys(curVisitingUser).length === 0
                ? visitedCountries
                : curVisitingUser.visitedCountries
            }
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

  useEffect(() => {
    const setIsFollowing = async () => {
      const response = await fetch(
        `${apiUrl}/api/users/following?followerId=${user.id}&followingId=${curVisitingUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Failed to get isFollowing data");
      } else {
        const isFollowing = await response.json();
        console.log("isFollowing", isFollowing);
        setIsFollowingUser(isFollowing);
      }
    };
    if (!loading && user) {
      setIsFollowing();
    }
  }, [curVisitingUser, user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    console.log("user: ", user);

    const getVisitedCountries = async () => {
      const countriesResponse = await fetch(`${apiUrl}/api/users/countries`, {
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
    if (!loading && user) {
      console.log("fetch following with user:", user);
      setCurVisitingUser(user);
      getVisitedCountries();
      fetchFollowing();
    }
  }, [user]);

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
          curUser={user}
          visitedCountries={visitedCountries}
          setVisitedCountries={setVisitedCountries}
          setListToShow={setListToShow}
          listToShow={listToShow}
          setCurVisitingUser={setCurVisitingUser}
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
            <PageWrapper>
              {isFollowingUser !== null && (
                <ProfileBanner
                  visitingUser={curVisitingUser}
                  setCurVisitingUser={setCurVisitingUser}
                  setPageToRender={setPageToRender}
                  renderedPage={pageToRender}
                  handleFollowUnfollow={followUnfollow}
                  isFollowingUser={isFollowingUser}
                />
              )}
              {renderPage()}
            </PageWrapper>
            <Box sx={{ width: "15%" }}>
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
                  setCurVisitingUser={setCurVisitingUser}
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
