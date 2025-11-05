// Auth utility functions
export const handleAuthError = (response: Response) => {
  if (response.status === 401) {
    // Clear auth token
    localStorage.removeItem("auth_token");
    // Redirect to signin page
    window.location.href = "/signin";
    return true;
  }
  return false;
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token") || "";
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  window.location.href = "/signin";
};
