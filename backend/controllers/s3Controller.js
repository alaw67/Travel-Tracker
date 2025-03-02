import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import asyncHandler from "express-async-handler";

const getPutPresignedS3URL = asyncHandler(async (req, res) => {
  console.log("here");
  const s3 = new S3Client({
    region: "ca-central-1",
  });
  const { key, fileType } = req.query;

  if (!key || !fileType) {
    return res.status(400).json({ error: "Missing fileName or fileType" });
  }

  const command = new PutObjectCommand({
    Bucket: `imagebucket-${process.env.AWS_ACCOUNT_ID}`,
    Key: key,
  });

  console.log("command", command);

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log("upload url", uploadUrl);
    res.json({ uploadUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Could not generate signed URL" });
  }
});

const getGetPresignedS3URL = asyncHandler(async (req, res) => {
  const s3 = new S3Client({
    region: "ca-central-1",
  });
  const { key } = req.query;
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: `imagebucket-${process.env.AWS_ACCOUNT_ID}`,
        Key: key,
      })
    );
    const command = new GetObjectCommand({
      Bucket: `imagebucket-${process.env.AWS_ACCOUNT_ID}`,
      Key: key,
    });
    const getUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // URL valid for 10 min
    console.log("getUrl", getUrl);
    res.json({ getUrl });
  } catch (error) {
    if (error.name === "NotFound") {
      console.log("File does not exist!", key);
      res.json({ getUrl: "" }); // Return null if the file is missing
    }
    throw error; // Handle other errors
  }
});

export { getPutPresignedS3URL, getGetPresignedS3URL };
