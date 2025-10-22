export const removeCountry = async (country: string) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const response = await fetch(`${apiUrl}/api/users/countries/delete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies in the request
    body: JSON.stringify({ country: country }),
  });

  console.log("response: ", response);

  if (!response.ok) {
    console.log("response failed");
  } else {
    const countries = await response.json();
    console.log("countries: ", countries);
    return countries;
  }
};
