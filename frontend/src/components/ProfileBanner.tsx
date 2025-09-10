import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import CloseIcon from "@mui/icons-material/Close";

const ProfileBanner = ({
  visitingUser,
  setCurVisitingUser,
  setPageToRender,
  renderedPage,
  handleFollowUnfollow,
  isFollowingUser,
}: {
  visitingUser: any;
  setCurVisitingUser: (user: string) => void;
  setPageToRender: (page: string) => void;
  renderedPage: string;
  handleFollowUnfollow: () => void;
  isFollowingUser: boolean | null;
}) => {
  const { user } = useAuthContext();
  console.log("visiting user", visitingUser);
  if (!visitingUser) {
    return <Box></Box>;
  }

  return (
    <Box
      sx={{
        // height: "16%",
        backgroundColor: "#e6eff5",
        borderRadius: "10px",
        paddingBottom: "15px",
      }}>
      {(renderedPage === "countryPage" || user !== visitingUser) && (
        <IconButton
          onClick={() => {
            setCurVisitingUser(user);
            setPageToRender("visitPage");
          }}
          sx={{ position: "absolute", right: "0px" }}>
          <CloseIcon sx={{ color: "#6C6C6C" }} />
        </IconButton>
      )}
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
          justifyContent: "center",
          width: "100%",
          gap: "10px",
        }}>
        <Typography
          sx={{
            alignContent: "center",
          }}
          variant="subtitle1">
          {`${visitingUser.visitedCountries.length} Visited Countries`}
        </Typography>

        {user !== visitingUser && (
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              paddingTop: "0px",
              paddingBottom: "0px",
              color: "black",
              borderColor: isFollowingUser ? "black" : "#3388b0",
            }}
            onClick={handleFollowUnfollow}>
            <Typography sx={{}} variant="subtitle1">
              {isFollowingUser ? "Following" : "Follow"}
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileBanner;
