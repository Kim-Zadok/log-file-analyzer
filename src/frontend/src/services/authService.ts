import api from "./api";
import { User } from "../types";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    const { token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem("auth_token", token);

    return { token, user };
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("auth_token");
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem("auth_token") !== null;
  },
};
