import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import CloseIcon from "@mui/icons-material/Close";

const cropImage = async (
  imageSrc: string, // URL or Base64 image source
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  fileType: string,
  fileName: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Avoid CORS issues if needed
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Canvas not supported");
        return;
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert canvas to Blob (async)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject("Canvas toBlob failed");
            return;
          }
          // Convert Blob to File with same format as original
          const file = new File([blob], fileName + fileType.split("/")[1], {
            type: fileType,
          });
          resolve(file);
        },
        fileType, // Keep original format (e.g., "image/jpeg")
        0.9 // Image quality (only affects JPEG/WebP)
      );
    };

    img.onerror = (err) => reject(err);
  });
};

const CropTool = ({
  image,
  imageNum,
  user,
  countryName,
  setCropModalOpen,
}: {
  image: File;
  imageNum: number;
  user: any;
  countryName: string;
  setCropModalOpen: (open: boolean) => void;
}) => {
  const imageType = image.type;
  const imageName = image.name;
  const imageUrl = URL.createObjectURL(image);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle File Upload
  const handleFileUpload = async (file: any, imageNum: number) => {
    console.log("uploading", file.type);
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/users/s3_put_presigned_url?key=${user.id}/${countryName}/${imageNum}&fileType=${file.type}`,
        {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        }
      );

      const { uploadUrl } = await response.json(); // This is the S3 upload URL
      console.log("uploadUrl", uploadUrl);
      const uploadResponse = await fetch(`${apiUrl}/uploadUrl`, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        console.log("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file!");
    }
  };

  const uploadCroppedImage = async () => {
    cropImage(
      imageUrl,
      croppedAreaPixels!.x,
      croppedAreaPixels!.y,
      croppedAreaPixels!.width,
      croppedAreaPixels!.height,
      imageType,
      imageName
    )
      .then((croppedImage) => {
        console.log("Cropped Image URL:", croppedImage);
        handleFileUpload(croppedImage, imageNum);
        setCropModalOpen(false);
      })
      .catch((err) => alert("Error cropping image: " + err));
  };

  return (
    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "80px",
        }}>
        <Cropper
          image={imageUrl}
          crop={crop}
          aspect={3 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
        <Button
          onClick={() => uploadCroppedImage()}
          variant="contained"
          color="primary"
          classes="cropButton">
          Upload
        </Button>
      </Box>
      <Box>
        <IconButton
          onClick={() => setCropModalOpen(false)}
          sx={{ float: "right" }}>
          <CloseIcon sx={{ color: "#6C6C6C" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CropTool;
