import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Modal,
} from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CropTool from "./CropTool";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CountryPage = ({
  countryName,
  setPageToRender,
}: {
  countryName: string;
  setPageToRender: (page: string) => void;
}) => {
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const [imageNum, setImageNum] = useState<number>(0);
  const { user } = useAuthContext();

  const photoNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleFileRetrieval = async (imageNum: number) => {
    try {
      const response = await fetch(
        `/api/users/s3_get_presigned_url?key=${user.id}/${countryName}/${imageNum}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const { getUrl } = await response.json(); // This is the S3 upload URL
      return getUrl;
    } catch (error) {
      console.error("Error getting file:", error);
    }
  };

  const Cell = ({ imageNum }: { imageNum: number }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetchImage = async () => {
        const url = await handleFileRetrieval(imageNum);
        setImageUrl(url);
      };

      fetchImage();
    }, [imageNum]);

    return imageUrl ? (
      <img
        src={imageUrl}
        alt={`${imageNum}`}
        style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
      />
    ) : (
      <Button
        sx={{ width: "100%", height: "100%" }}
        component="label"
        role={undefined}
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}>
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              console.log(e.target.files[0]);
              setCropModalOpen(true);
              setImageToCrop(e.target.files[0]);
              setImageNum(imageNum);
            }
          }}
        />
      </Button>
    );
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
      }}>
      <Modal open={cropModalOpen}>
        <CropTool
          image={imageToCrop}
          imageNum={imageNum}
          user={user}
          countryName={countryName}
          setCropModalOpen={setCropModalOpen}
        />
      </Modal>
      <IconButton
        onClick={() => setPageToRender("worldMap")}
        sx={{ float: "right" }}>
        <CloseIcon sx={{ color: "#6C6C6C" }} />
      </IconButton>
      <Typography
        sx={{
          marginBottom: "10px",
          marginTop: "25px",
          marginLeft: "25px",
          display: "flex",
          justifyContent: "center",
        }}
        variant="h5">
        {countryName}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Grid
          container
          spacing={1} // Adds gaps between grid items
          sx={{ width: "65%", maxWidth: "500px" }}>
          {photoNums.map((num) => (
            <Grid
              item
              xs={4}
              key={num}
              sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  aspectRatio: "1 / 1", // Ensures square shape
                  width: "100%", // Adjust width to prevent overlap
                  height: "100%",
                  // padding: 2,
                }}>
                <Cell imageNum={num} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CountryPage;
