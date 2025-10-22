import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // First try to get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header for backward compatibility
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
