export const getFollowers = async (userId: string, token: string) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(
    `${apiUrl}/api/users/following/followers?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to get followers");
  // console.log(res.json());
  return res.json();
};
