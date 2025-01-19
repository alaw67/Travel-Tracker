import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getFollowing = asyncHandler(async (req, res) => {
  const { following } = req.user;
  console.log("REQ", req);
  res.status(200).json({
    following,
  });
});

const addFollowing = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.body.id);
  console.log("user", req.user);
  req.user.following.push(req.body.id);
  userToFollow.followers.push(req.user.id);
  await req.user.save();
  await userToFollow.save();
  const { following } = req.user.following;
  res.status(200).json({
    following,
  });
});

export { getFollowing, addFollowing };
