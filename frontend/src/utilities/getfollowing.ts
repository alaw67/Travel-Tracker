export const getFollowing = async (userId: string) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(
    `${apiUrl}/api/users/following/following?userId=${userId}`,
    {
      method: "GET",
      credentials: 'include', // Include cookies in the request
    }
  );

  if (!res.ok) throw new Error("Failed to get following users");
  // console.log(res.json());
  return res.json();
};
