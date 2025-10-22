import React, { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext<any | string | null>(null);

type Action = {
  type: string;
  payload: any;
};

export type UserState = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

type State = {
  user: UserState | null;
};

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    // Check if user is authenticated by making a request to /me endpoint
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          method: "GET",
          credentials: 'include', // Include cookies in the request
        });
        console.log("response: ", response);
        if (response.ok) {
          const userData = await response.json();
          dispatch({
            type: "LOGIN",
            payload: userData,
          });
        } else {
          console.log("response not ok");
          dispatch({
            type: "LOGOUT",
            payload: null,
          });
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loading, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
