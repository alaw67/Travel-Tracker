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
  token: string;
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
    if (localStorage.getItem("user")) {
      dispatch({
        type: "LOGIN",
        payload: JSON.parse(localStorage.getItem("user")!),
      });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loading, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
