export const removeCountry = async (token: string, country: string) => {
  const apiUrl = process.env.API_URL;
  const response = await fetch(`${apiUrl}/api/users/countries/delete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
