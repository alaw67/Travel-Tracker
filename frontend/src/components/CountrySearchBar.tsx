import React, { useState } from "react";
import countries from "../data/countries";
import { Box, TextField, List, ListItemButton } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";

const AutocompleteSearchBar = ({
  setVisitedCountries,
}: {
  setVisitedCountries: (countries: [string]) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredCountries, setFilteredCountries] =
    useState<string[]>(countries);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const { user } = useAuthContext();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (!value) {
      setShowDropdown(false);
    } else {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);

      setShowDropdown(filtered.length > 0);
    }
  };

  const handleSelectCountry = (country: string) => {
    setInputValue("");
    addVisitedCountry(country);
    setFilteredCountries(countries);
    setShowDropdown(false);
  };

  const addVisitedCountry = async (country: string) => {
    console.log("token...", user?.token);
    const response = await fetch("/api/users/countries", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ country: country }),
    });

    console.log("response: ", response);

    if (!response.ok) {
      console.log("response failed");
    } else {
      const countries = await response.json();
      console.log("countries: ", countries);
      setVisitedCountries(countries.visitedCountries);
    }
  };
  return (
    <Box sx={{ margin: "0 auto", width: "30%" }}>
      <TextField
        sx={{
          "& fieldset": { border: "none" },
          position: "relative",
          "&:hover": { backgroundColor: "#fcfcfc" },
          backgroundColor: focused ? "#fcfcfc" : "#f2f5f7",
          borderRadius: "20px",
          width: "100%",
        }}
        onFocus={(e) => {
          setFocused(!focused);
          setShowDropdown(true);
        }}
        onBlur={() => {
          setFocused(!focused);
          setShowDropdown(false);
        }}
        type="text"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a country to add..."
      />
      {showDropdown && (
        <List
          sx={{
            position: "absolute",
            backgroundColor: "white",
            boxShadow: "0px 8px 6px -6px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            width: "400px",
            zIndex: "100",
          }}>
          {filteredCountries.slice(0, 7).map((country) => (
            <ListItemButton
              key={country}
              onMouseOver={() => {
                console.log("hell0");
              }}
              onMouseDown={() => handleSelectCountry(country)}>
              {country}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AutocompleteSearchBar;
