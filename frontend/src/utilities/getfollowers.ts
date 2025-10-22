export const getFollowers = async (userId: string) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(
    `${apiUrl}/api/users/following/followers?userId=${userId}`,
    {
      method: "GET",
      credentials: 'include', // Include cookies in the request
    }
  );

  if (!res.ok) throw new Error("Failed to get followers");
  // console.log(res.json());
  return res.json();
};
