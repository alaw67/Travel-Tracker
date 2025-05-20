export const getFollowing = async (userId: string, token: string) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(
    `${apiUrl}/api/users/following/following?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to get following users");
  // console.log(res.json());
  return res.json();
};
