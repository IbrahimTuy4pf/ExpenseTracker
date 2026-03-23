import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userAPI } from "../services/api";
import useStore from "../store";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    
    if (errorParam) {
      setError(errorParam === "authentication_failed" ? "Google authentication failed. Please try again." : errorParam);
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    
    if (token) {
      // Token is already set in cookie by backend
      // Fetch user data
      const fetchUser = async () => {
        try {
          const userData = await userAPI.getUser();
          if (userData.status === "success") {
            setUser(userData.user, token);
            navigate("/");
          } else {
            setError(userData.message || "Failed to fetch user data");
            setTimeout(() => navigate("/login"), 3000);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setError(err.message || "Authentication failed");
          setTimeout(() => navigate("/login"), 3000);
        }
      };
      
      fetchUser();
    } else {
      // If no token, redirect to login with error
      setError("No authentication token received");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

