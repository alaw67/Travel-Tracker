import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const logIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    console.log("login data: ", JSON.stringify({ email, password }));
    console.log("apiUrl", apiUrl);

    const response = await fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log("data: ", data);

    if (!response.ok) {
      console.log("response failed");
      setIsLoading(false);
      setError(data.message);
      return false;
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(data));

      dispatch({ type: "LOGIN", payload: data });

      setIsLoading(false);
      navigate("/");
    }
  };
  return { logIn, isLoading, error };
};
