"use client";

import { getAuthToken, handleAuthError } from "@/lib/auth";
import { config } from "@/lib/config";
import { useCallback, useEffect, useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const SecuritySettings = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState<"password" | "email">(
    "password",
  );

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${config.apiBaseUrl}/security/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setNewEmail(data.email);
      } else {
        if (handleAuthError(response)) return;
        setError("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch user profile");
    }
  }, []);

  // Clear form
  const clearForm = useCallback(() => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNewEmail(userProfile?.email || "");
    setError("");
    setSuccess("");
  }, [userProfile?.email]);

  // Change password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getAuthToken();
      const response = await fetch(
        `${config.apiBaseUrl}/security/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully!");
        clearForm();
      } else {
        if (handleAuthError(response)) return;
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Change email
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getAuthToken();
      const response = await fetch(
        `${config.apiBaseUrl}/security/change-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newEmail,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email updated successfully!");
        setUserProfile(data.user);
        clearForm();
      } else {
        if (handleAuthError(response)) return;
        setError(data.error || "Failed to update email");
      }
    } catch (err) {
      console.error("Error changing email:", err);
      setError("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    clearForm();
  }, [activeSection, clearForm, userProfile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-fg text-xl font-semibold">Security Settings</h2>
        <p className="text-text-secondary text-sm">
          Manage your account security and credentials
        </p>
      </div>

      {/* User Profile Info */}
      {userProfile && (
        <div className="bg-secondary/10 rounded-lg p-4">
          <h3 className="text-fg mb-3 text-lg font-medium">
            Account Information
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                Username
              </label>
              <p className="text-fg mt-1">{userProfile.username}</p>
            </div>
            <div>
              <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                Email
              </label>
              <p className="text-fg mt-1">{userProfile.email}</p>
            </div>
            <div>
              <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                Member Since
              </label>
              <p className="text-text-secondary mt-1 text-sm">
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-text-muted text-xs font-medium tracking-wide uppercase">
                Last Updated
              </label>
              <p className="text-text-secondary mt-1 text-sm">
                {new Date(userProfile.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Section Tabs */}
      <div className="bg-secondary/10 rounded-lg p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection("password")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === "password"
                ? "bg-primary text-bg"
                : "bg-secondary/40 text-fg hover:bg-secondary/60"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveSection("email")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === "email"
                ? "bg-primary text-bg"
                : "bg-secondary/40 text-fg hover:bg-secondary/60"
            }`}
          >
            Change Email
          </button>
        </div>

        {/* Change Password Form */}
        {activeSection === "password" && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Change Email Form */}
        {activeSection === "email" && (
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="text-fg mb-2 block text-sm font-medium">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="bg-secondary/40 border-border text-fg focus:ring-primary/50 w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Enter new email address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-bg rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
