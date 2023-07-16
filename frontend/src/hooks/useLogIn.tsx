import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const logIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    console.log("login data: ", JSON.stringify({ email, password }));

    const response = await fetch("/api/users/login", {
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
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(data));

      dispatch({ type: "LOGIN", payload: data });

      setIsLoading(false);
    }
  };
  return { logIn, isLoading, error };
};
