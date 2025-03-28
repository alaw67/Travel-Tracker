import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import { useAuthContext } from "../hooks/useAuthContext";

type followedUser = {
  firstName: string;
  lastName: string;
  id: string;
  visitedCountries: [string];
};

export const FollowingList = ({
  userToken,
  following,
  setUserToRemove,
  setUserToVisit,
  setVisiting,
  setPageToRender,
}: {
  userToken: string;
  following: [string];
  setUserToRemove: (friend: string) => void;
  setUserToVisit: (user: any) => void;
  setVisiting: (visiting: boolean) => void;
  setPageToRender: (page: string) => void;
}) => {
  console.log("rendering following list");
  const FollowingItem = ({ followedUserId }: { followedUserId: string }) => {
    const [followedUser, setFollowedUser] = useState<followedUser>({
      firstName: "",
      lastName: "",
      id: "",
      visitedCountries: [""],
    });
    const [deleteUserOption, setDeleteUserOption] = useState<boolean>(false);
    useEffect(() => {
      console.log("rendering followed user");
      const getUser = async (userId: string) => {
        const response = await fetch(`api/users/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("response failed");
        }

        const user = await response.json();
        console.log("USER:", user);
        setFollowedUser(user);
      };

      getUser(followedUserId);
    }, [followedUserId]);

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
          console.log("followeduser", followedUser);
          setPageToRender("visitPage");
          setUserToVisit(followedUser);
          setVisiting(true);
        }}>
        <Avatar
          sx={{
            width: "40px",
            height: "40px",
          }}
          alt={
            followedUser
              ? `${followedUser.firstName} ${followedUser.lastName}`
              : ""
          }
          // src="/static/images/avatar/1.jpg"
        />
        <Typography sx={{ marginLeft: "30px" }} variant="body1">
          {`${followedUser.firstName} ${followedUser.lastName}`}
        </Typography>
        <Box
          onClick={() => {
            setUserToRemove(followedUser.id);
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
        {following.map((followId, i) => {
          return <FollowingItem key={i} followedUserId={followId} />;
        })}
      </Box>
    </Box>
  );
};
