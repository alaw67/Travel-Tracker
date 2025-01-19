import { Box, Typography, Button } from "@mui/material";

export const Modal = ({ children }: { children: any }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "0px",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "500px",
          height: "200px",
          backgroundColor: "white",
          borderRadius: "10px",
        }}>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};
