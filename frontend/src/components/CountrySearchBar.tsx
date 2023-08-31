import React, { useState } from "react";
import countries from "../data/countries";
import { Box, TextField, List, ListItemButton } from "@mui/material";

const AutocompleteSearchBar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

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
    setInputValue(country);
    setFilteredCountries([]);
    setShowDropdown(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0px 10px 0 rgba(0, 0, 0, 0.19)",
      }}>
      <Box
        sx={{
          margin: "8px",
        }}>
        <TextField
          sx={{
            "& fieldset": { border: "none" },
            position: "relative",
            "&:hover": { backgroundColor: "#fcfcfc" },
            backgroundColor: focused ? "#fcfcfc" : "#FFFFFF",
            width: "95%",
            borderRadius: "10px",
          }}
          onFocus={() => setFocused(!focused)}
          onBlur={() => setFocused(!focused)}
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
            }}>
            {filteredCountries.slice(0, 7).map((country) => (
              <ListItemButton
                key={country}
                onClick={() => handleSelectCountry(country)}>
                {country}
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default AutocompleteSearchBar;
