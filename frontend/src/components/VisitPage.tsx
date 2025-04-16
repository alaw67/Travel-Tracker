import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthContext } from "../hooks/useAuthContext";
import WorldMap from "./WorldMap";
import { followUser } from "../utilities/follow";
import { unfollowUser } from "../utilities/unfollow";

const VisitPage = ({
  visitingUser,
  setPageToRender,
  fetchFollowing,
}: {
  visitingUser: any;
  setPageToRender: (page: string) => void;
  fetchFollowing: () => void;
}) => {
  console.log("visited user:", visitingUser);
  const { user } = useAuthContext();
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(false);

  useEffect(() => {
    const isFollowing = async () => {
      const response = await fetch(
        `/api/users/following?followerId=${user.id}&followingId=${visitingUser._id}`,
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
    isFollowing();
  }, [visitingUser]);

  const handleClick = async () => {
    if (isFollowingUser) {
      await unfollowUser(user.id, visitingUser._id, user.token);
    } else {
      await followUser(user.id, visitingUser._id, user.token);
    }
    setIsFollowingUser(!isFollowingUser);
    fetchFollowing();
  };

  return (
    <Box
      sx={{
        width: "80%",
        height: "90vh",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
        // paddingTop: "15px",
        border: "1px solid #d8dfe3",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
      <Box
        sx={{
          height: "16%",
          backgroundColor: "#e6eff5",
        }}>
        <IconButton
          onClick={() => setPageToRender("worldMap")}
          sx={{ position: "absolute", right: "0px" }}>
          <CloseIcon sx={{ color: "#6C6C6C" }} />
        </IconButton>
        <Typography
          sx={{
            marginBottom: "10px",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "center",
          }}
          variant="h5">
          {`${visitingUser.firstName} ${visitingUser.lastName}`}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            // backgroundColor: "green",
            justifyContent: "center",
            width: "100%",
            gap: "10px",
          }}>
          <Typography
            sx={{
              // marginBottom: "10px",
              // display: "flex",
              // justifyContent: "center",
              alignContent: "center",
            }}
            variant="subtitle1">
            {`${visitingUser.visitedCountries.length} Visited Countries`}
          </Typography>

          <Button
            variant="outlined"
            sx={{
              // backgroundColor: "#de362a",
              textTransform: "none",
              paddingTop: "0px",
              paddingBottom: "0px",
              color: "black",
              borderColor: isFollowingUser ? "black" : "#3388b0",
            }}
            onClick={handleClick}>
            <Typography sx={{}} variant="subtitle1">
              {isFollowingUser ? "Following" : "Follow"}
            </Typography>
          </Button>
        </Box>
      </Box>
      <WorldMap
        visitedCountries={visitingUser.visitedCountries}
        height={"100%"}
      />
    </Box>
  );
};

export default VisitPage;
