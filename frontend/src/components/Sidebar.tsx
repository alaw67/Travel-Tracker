import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Sidebar = ({
  user,
}: {
  user: { firstName: string; lastName: string };
}) => {
  return (
    <Box
      sx={{ position: "relative", width: "350px", backgroundColor: "#33383e" }}>
      <Box sx={{}}>
        <Box
          component="img"
          sx={{
            filter: "brightness(70%)",
            width: 350,
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
            left: "105px",
          }}>
          <Avatar
            sx={{
              width: "120px",
              height: "120px",
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
      </Box>
    </Box>
  );
};

export default Sidebar;
