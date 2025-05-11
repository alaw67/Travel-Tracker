import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";

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

export const FollowingList = ({
  setUserToRemove,
  setCurVisitingUser,
  setPageToRender,
  followingUsers,
  setIsUnfollowingUser,
}: {
  setUserToRemove: (friend: string) => void;
  setCurVisitingUser: (user: any) => void;
  setPageToRender: (page: string) => void;
  followingUsers: Follow[];
  setIsUnfollowingUser: (unfollowing: boolean) => void;
}) => {
  console.log("rendering following list");

  const FollowingItem = ({ user }: { user: FollowedUser }) => {
    const [deleteUserOption, setDeleteUserOption] = useState<boolean>(false);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F6FCFF",
          width: "100%",
          height: "40px",
          marginTop: "7px",
          borderRadius: "50px 15px 15px 50px",
          boxShadow: "0px 3px 5px 1px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#e6edf0",
          },
        }}
        onMouseEnter={() => {
          setDeleteUserOption(true);
        }}
        onMouseLeave={() => {
          setDeleteUserOption(false);
        }}
        onClick={() => {
          console.log("followeduser", user._id);
          setPageToRender("visitPage");
          setCurVisitingUser(user);
        }}>
        <Avatar
          sx={{
            width: "40px",
            height: "40px",
          }}
          alt={user ? `${user.firstName} ${user.lastName}` : ""}
          // src="/static/images/avatar/1.jpg"
        />
        <Typography sx={{ marginLeft: "30px" }} variant="body1">
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Box
          onClick={() => {
            setUserToRemove(`${user.firstName} ${user.lastName}`);
            setIsUnfollowingUser(true);
          }}
          sx={{ marginLeft: "auto", marginRight: "10px" }}>
          {deleteUserOption && (
            <IconButton>
              <CloseIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "15px",
                  color: "#c20000",
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        width: "100%",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
      }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ marginLeft: "30px", marginTop: "14px", color: "#6C6C6C" }}>
          {"Following"}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "15px",
          paddingBottom: "20px",
          overflowY: "scroll",
        }}>
        {followingUsers.map((follow, i) => {
          return <FollowingItem key={i} user={follow.following} />;
        })}
      </Box>
    </Box>
  );
};
