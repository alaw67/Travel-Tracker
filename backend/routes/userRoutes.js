import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  getUser,
  logoutUser,
} from "../controllers/userController.js";
import {
  getVisitedCountries,
  addVisitedCountry,
  removeVisitedCountry,
} from "../controllers/countriesController.js";

import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowing,
  getFollowers,
  getSearchedFollowing,
} from "../controllers/followingController.js";

import {
  getPutPresignedS3URL,
  getGetPresignedS3URL,
} from "../controllers/s3Controller.js";

import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.patch("/countries", protect, addVisitedCountry);
router.patch("/countries/delete", protect, removeVisitedCountry);
router.get("/me", protect, getMe);
router.get("/user/:id", protect, getUser);
router.get("/countries", protect, getVisitedCountries);
router.post("/following/follow", protect, followUser);
router.post("/following/unfollow", protect, unfollowUser);
router.get("/following", protect, isFollowing);
router.get("/following/followers", protect, getFollowers);
router.get("/following/following", protect, getFollowing);
router.get("/following/search", protect, getSearchedFollowing);
router.get("/s3_put_presigned_url", protect, getPutPresignedS3URL);
router.get("/s3_get_presigned_url", protect, getGetPresignedS3URL);

export default router;
