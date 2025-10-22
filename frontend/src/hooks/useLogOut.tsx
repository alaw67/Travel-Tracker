import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const apiUrl = process.env.REACT_APP_API_URL;

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await fetch(`${apiUrl}/api/users/logout`, {
        method: "POST",
        credentials: 'include', // Include cookies in the request
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Clear local state regardless of backend response
      dispatch({ type: "LOGOUT" });
    }
  };

  return logout;
};
