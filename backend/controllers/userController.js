import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  console.log("user: ", user);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const userExists = await User.findOne({ email });

  console.log("userExists: ", userExists);

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  console.log("req.user: ", req.user);
  const { id, firstName, lastName, email } = req.user;

  res.status(200).json({
    firstName,
    lastName,
    id,
    email,
  });
});

const getVisitedCountries = asyncHandler(async (req, res) => {
  const { visitedCountries } = req.user;
  res.status(200).json({
    visitedCountries,
  });
});

const addVisitedCountry = asyncHandler(async (req, res) => {
  const { country } = req.body;

  console.log("visitedCountries: ", req.user.visitedCountries);

  req.user.visitedCountries.push(country);

  await req.user.save();
  console.log("visitedCountries: ", req.user.visitedCountries);
  const { visitedCountries } = req.user;
  res.status(200).json({
    visitedCountries,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export {
  loginUser,
  registerUser,
  getMe,
  getVisitedCountries,
  addVisitedCountry,
};
