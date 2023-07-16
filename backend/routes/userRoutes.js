import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  getVisitedCountries,
  addVisitedCountry,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.patch("/countries", protect, addVisitedCountry);
router.get("/me", protect, getMe);
router.get("/countries", protect, getVisitedCountries);

export default router;
