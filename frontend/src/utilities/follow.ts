export const followUser = async (
  followerId: string,
  followingId: string
) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(`${apiUrl}/api/users/following/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies in the request
    body: JSON.stringify({ followerId, followingId }),
  });

  if (!res.ok) throw new Error("Failed to follow user");
  console.log("following user");
  return res.json();
};
