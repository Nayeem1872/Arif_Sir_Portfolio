import { apiClient } from "./client";

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const authApi = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/signup", data);
      console.log("Raw signup response:", response);
      return response.data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  },

  signin: async (data: SigninData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", data);
      console.log("Raw signin response:", response);
      return response.data;
    } catch (error) {
      console.error("Signin API error:", error);
      throw error;
    }
  },
};

// Helper functions for token management
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem("auth_token", token);
    // Also set as cookie for middleware (24 hours)
    document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}`;
  },

  getToken: () => {
    return localStorage.getItem("auth_token");
  },

  removeToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    // Remove cookie
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  },

  setUser: (user: User) => {
    localStorage.setItem("user_data", JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },
};
