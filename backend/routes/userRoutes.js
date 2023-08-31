import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  getVisitedCountries,
  addVisitedCountry,
  removeVisitedCountry,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.patch("/countries", protect, addVisitedCountry);
router.patch("/countries/delete", protect, removeVisitedCountry);
router.get("/me", protect, getMe);
router.get("/countries", protect, getVisitedCountries);

export default router;
