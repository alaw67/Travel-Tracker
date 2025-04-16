export const getFollowing = async (userId: string, token: string) => {
  const res = await fetch(`/api/users/following/following?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to get following users");
  // console.log(res.json());
  return res.json();
};
