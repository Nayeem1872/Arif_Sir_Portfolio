import {
  authApi,
  ErrorResponse,
  SigninData,
  SignupData,
  tokenManager,
  User,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthSuccess = (token: string, user: User) => {
    tokenManager.setToken(token);
    tokenManager.setUser(user);
    router.push("/dashboard");
  };

  const handleAuthError = (error: any) => {
    console.log("Error details:", error);

    // Check if it's actually a successful response (status 200-299)
    if (error?.response?.status >= 200 && error?.response?.status < 300) {
      console.log("This is actually a successful response, not an error");
      return;
    }

    if (error?.response?.data) {
      const errorData = error.response.data as ErrorResponse;
      if (errorData.errors && errorData.errors.length > 0) {
        // Show first validation error
        setError(errorData.errors[0].message);
      } else {
        setError(errorData.message || "An error occurred");
      }
    } else if (error?.message) {
      setError(error.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.signup(data);
      console.log("Signup response:", response); // Debug log

      // Check if response has the expected structure
      // Your API returns: { message, token, user } directly
      if (response && response.token && response.user) {
        handleAuthSuccess(response.token, response.user);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Signup successful but unexpected response format");
      }
    } catch (error) {
      console.error("Signup error:", error); // Debug log
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (data: SigninData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.signin(data);
      console.log("Signin response:", response); // Debug log

      // Check if response has the expected structure
      // Your API returns: { message, token, user } directly
      if (response && response.token && response.user) {
        handleAuthSuccess(response.token, response.user);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Signin successful but unexpected response format");
      }
    } catch (error) {
      console.error("Signin error:", error); // Debug log
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    router.push("/signin");
  };

  return {
    isLoading,
    error,
    signup,
    signin,
    logout,
  };
};
