import { Box } from "@mui/material";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "85%",
        height: "90vh",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
        // paddingTop: "15px",
        border: "1px solid #d8dfe3",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "center",
      }}>
      {children}
    </Box>
  );
};

export default PageWrapper;
