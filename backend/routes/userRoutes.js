import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  getUser,
} from "../controllers/userController.js";
import {
  getVisitedCountries,
  addVisitedCountry,
  removeVisitedCountry,
} from "../controllers/countriesController.js";

import {
  getFollowing,
  addFollowing,
} from "../controllers/followingController.js";

import {
  getPutPresignedS3URL,
  getGetPresignedS3URL,
} from "../controllers/s3Controller.js";

import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.patch("/countries", protect, addVisitedCountry);
router.patch("/countries/delete", protect, removeVisitedCountry);
router.patch("/following", protect, addFollowing);
router.get("/me", protect, getMe);
router.get("/user/:id", protect, getUser);
router.get("/countries", protect, getVisitedCountries);
router.get("/following", protect, getFollowing);
router.get("/s3_put_presigned_url", protect, getPutPresignedS3URL);
router.get("/s3_get_presigned_url", protect, getGetPresignedS3URL);

export default router;
