export const getFollowers = async (userId: string, token: string) => {
  const res = await fetch(`/api/users/following/followers?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to get followers");
  // console.log(res.json());
  return res.json();
};
