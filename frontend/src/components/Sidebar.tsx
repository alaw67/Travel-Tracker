import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Sidebar = ({
  user,
  setIsFollowingModalOpen,
}: {
  user: { firstName: string; lastName: string };
  setIsFollowingModalOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Box
      sx={{ position: "relative", width: "250px", backgroundColor: "#33383e" }}>
      <Box
        component="img"
        sx={{
          filter: "brightness(70%)",
          width: 250,
          objectFit: "cover",
        }}
        alt="Cover photo"
        src={require("../data/mountain.jpeg")}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "30px",
          left: "100px",
        }}>
        <Avatar
          sx={{
            width: "100px",
            height: "100px",
          }}
          alt={user ? `${user.firstName} ${user.lastName}` : ""}
          src="/static/images/avatar/1.jpg"
        />
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            color: "#FFFFFF",
          }}>
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </Typography>
      </Box>
      <Box>
        <Button
          variant="outlined"
          onClick={() => {
            console.log("Clicked Following");
            setIsFollowingModalOpen(true);
          }}>
          Following
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
