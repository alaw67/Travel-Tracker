import React, { useState, useCallback } from "react";
import {
  TextField,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import debounce from "lodash.debounce";

interface User {
  firstName: string;
  lastName: string;
}

const UserSearchBar = ({
  setCurVisitingUser,
  setPageToRender,
}: {
  setCurVisitingUser: (user: any) => void;
  setPageToRender: (page: string) => void;
}) => {
  const [results, setResults] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState<boolean>(false);
  const { user } = useAuthContext();

  console.log("user", user);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
    }
    try {
      const response = await fetch(
        `api/users/following/search?query=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("response failed");
      }
      const users = await response.json();
      console.log("fetched users:", users);
      setResults(users);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchUsers(query);
    }, 300),
    [] // important: only create the debounced function once
  );

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
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="Search for user..."
      />
      <Box sx={{ width: "100%" }}>
        {showDropdown && results.length > 0 && (
          <Paper style={{ position: "absolute", zIndex: 1000 }}>
            <List sx={{ width: "400px" }}>
              {results.map((user, index) => (
                <ListItemButton
                  key={index}
                  onMouseDown={() => {
                    setCurVisitingUser(user);
                    setPageToRender("visitPage");
                  }}>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default UserSearchBar;
