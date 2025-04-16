import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Follow from "../models/followModel.js";
import mongoose from "mongoose";

const followUser = asyncHandler(async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res
      .status(400)
      .json({ message: "Missing followerId or followingId" });
  }

  if (followerId === followingId) {
    return res.status(400).json({ message: "User cannot follow themselves" });
  }

  // Ensure IDs are valid ObjectId
  if (
    !mongoose.Types.ObjectId.isValid(followerId) ||
    !mongoose.Types.ObjectId.isValid(followingId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid followerId or followingId" });
  }

  // Check if already following
  const alreadyFollowing = await Follow.exists({
    follower: followerId,
    following: followingId,
  });
  if (alreadyFollowing) {
    return res.status(200).json({ message: "Already following" });
  }

  // Create follow relationship
  const newFollow = await Follow.create({
    follower: followerId,
    following: followingId,
  });

  res.status(201).json({ message: "Followed user", follow: newFollow });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { followerId, followingId } = req.body;

  const result = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (!result) {
    res.status(404).json({ message: "Follow relationship not found" });
  }

  res.status(200).json({ message: "Successfully unfollowed" });
});

const isFollowing = asyncHandler(async (req, res) => {
  const { followerId, followingId } = req.query;

  const isFollowing = await Follow.exists({
    follower: followerId,
    following: followingId,
  });
  console.log("isFollowing: ", isFollowing);
  res.status(200).json(!!isFollowing);
});

const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "firstName lastName visitedCountries"
  );
  res.status(200).json(following);
});

const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "firstName lastName"
  );

  res.status(200).json(followers);
});

const getSearchedFollowing = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    // Search for users by first or last name (case-insensitive)
    const users = await User.find({
      $or: [
        { firstName: { $regex: `^${query}`, $options: "i" } },
        { lastName: { $regex: `^${query}`, $options: "i" } },
      ],
    })
      .limit(7) // Limit results for efficiency
      .select("firstName lastName visitedCountries"); // Only return necessary fields

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowing,
  getFollowers,
  getSearchedFollowing,
};
