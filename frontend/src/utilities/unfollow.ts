export const unfollowUser = async (
  followerId: string,
  followingId: string
) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(`${apiUrl}/api/users/following/unfollow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies in the request
    body: JSON.stringify({ followerId, followingId }),
  });

  if (!res.ok) throw new Error("Failed to unfollow user");
  console.log("unfollowing user");
};
