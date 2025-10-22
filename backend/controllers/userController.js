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
    const token = generateToken(user.id);
    
    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      visitedCountries: user.visitedCountries,
      following: [],
      followers: [],
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

  console.log("created user", user);

  if (user) {
    const token = generateToken(user.id);
    
    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      following: user.following,
      followers: user.followers,
      visitedCountries: user.visitedCountries,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  console.log("req.user: ", req.user);
  const { id, firstName, lastName, email, following, followers } = req.user;

  res.status(200).json({
    firstName,
    lastName,
    id,
    email,
    following,
    followers,
    visitedCountries,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log("user: ", user);
  const { firstName, lastName, id, visitedCountries } = user;
  if (user) {
    res.status(200).json({
      firstName,
      lastName,
      id,
      visitedCountries,
    });
  } else {
    res.status(400);
    throw new Error("Cannot get user!");
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0) // Expire immediately
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { loginUser, registerUser, getMe, getUser, logoutUser };
