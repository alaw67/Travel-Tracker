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
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
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
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const keys = req.query.key;
  const keyArray = Array.isArray(keys) ? keys : [keys];

  console.log("keyArray:", keyArray);

  const urls = await Promise.all(
    keyArray.map(async (key) => {
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
        return await getSignedUrl(s3, command, { expiresIn: 600 });
      } catch (error) {
        if (error.name === "NotFound") {
          console.log("File does not exist!", key);
        }
        return null;
      }
    })
  );
  console.log("urls:", urls);
  res.json({ getUrls: urls });
});

export { getPutPresignedS3URL, getGetPresignedS3URL };
