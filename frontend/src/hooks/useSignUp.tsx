import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const useSignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const signUp = async (user: User) => {
    setIsLoading(true);
    setError(null);

    console.log("signup data: ", JSON.stringify(user));

    const response = await fetch(`${apiUrl}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    console.log("data: ", data);

    if (!response.ok) {
      console.log("response failed");
      setIsLoading(false);
      setError(data.error);
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(data));

      dispatch({ type: "LOGIN", payload: data });

      setIsLoading(false);
      navigate("/");
    }
  };
  return { signUp, isLoading, error };
};
