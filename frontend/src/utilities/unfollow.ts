export const unfollowUser = async (
  followerId: string,
  followingId: string,
  token: string
) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(`${apiUrl}/api/users/following/unfollow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ followerId, followingId }),
  });

  if (!res.ok) throw new Error("Failed to unfollow user");
  console.log("unfollowing user");
};
