export const followUser = async (
  followerId: string,
  followingId: string,
  token: string
) => {
  const res = await fetch("/api/users/following/follow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ followerId, followingId }),
  });

  if (!res.ok) throw new Error("Failed to follow user");
  console.log("following user");
  return res.json();
};
