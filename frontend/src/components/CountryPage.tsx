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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const { user, loading } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const imageNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  console.log("countryName: ", countryName);

  useEffect(() => {
    const handleFileRetrieval = async (keys: string[]) => {
      console.log("fetching images");
      const params = new URLSearchParams();

      keys.forEach((key) => params.append("key", key));
      try {
        const response = await fetch(
          `${apiUrl}/api/users/s3_get_presigned_url?${params.toString()}"`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const { getUrls } = await response.json(); // This is the S3 upload URL
        console.log("getUrls: ", getUrls);
        setImageUrls(getUrls);
      } catch (error) {
        console.error("Error getting file:", error);
      }
    };
    if (user && !loading) {
      const keys = imageNums.map(
        (imageNum) => `${user.id}/${countryName}/${imageNum}`
      );
      console.log("keys:", keys);
      handleFileRetrieval(keys);
    }
  }, [user, countryName]);

  useEffect(() => {
    if (imageUrls.length === 0) return;

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === imageUrls.length) {
        setAllImagesLoaded(true);
      }
    };

    imageUrls.forEach((url) => {
      console.log("url:", url);
      if (!url) {
        handleImageLoad();
      } else {
        const img = new Image();
        img.src = url;
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad; // Still count it to prevent hanging
      }
    });
  }, [imageUrls]);

  const Cell = ({ imageNum }: { imageNum: number }) => {
    return imageUrls[imageNum - 1] ? (
      <img
        src={imageUrls[imageNum - 1]}
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
        // width: "85%",
        height: "90vh",
        backgroundColor: "#f2f5f7",
        borderRadius: "10px",
        // paddingTop: "15px",
        // border: "1px solid #d8dfe3",
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
      <Typography
        sx={{
          marginBottom: "10px",
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
        }}
        variant="h5">
        {countryName}
      </Typography>

      {allImagesLoaded && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Grid container spacing={1} sx={{ width: "65vh", maxWidth: "500px" }}>
            {imageNums.map((num) => (
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
      )}
    </Box>
  );
};

export default CountryPage;
