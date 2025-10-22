"use client";

import { HoverBorderButton } from "@/components/ui/hover-button";
import { useAuth } from "@/hooks/use-auth";
import {
  IconAt,
  IconEye,
  IconEyeOff,
  IconLock,
  IconLogin,
  IconUserCircle,
  IconUserPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import AuthField from "./auth-field";

interface AuthFormProps {
  isSignUp: boolean;
}

const AuthForm = ({ isSignUp }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isLoading, error, signup, signin } = useAuth();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    // Clear validation error when user starts typing
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    if (!form.email || !form.password) {
      setValidationError("Please fill in all required fields");
      return;
    }

    if (isSignUp) {
      if (!form.username) {
        setValidationError("Username is required");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }
      if (form.password.length < 6) {
        setValidationError("Password must be at least 6 characters long");
        return;
      }

      await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
    } else {
      await signin({
        email: form.email,
        password: form.password,
      });
    }
  };

  return (
    <div className="bg-card/50 border-border rounded-lg border p-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <AuthField
            name="username"
            type="text"
            value={form.username}
            handleChange={handleChange}
            placeholder="Your username"
            icon={IconUserCircle}
            required
          />
        )}

        <AuthField
          name="email"
          type="email"
          value={form.email}
          handleChange={handleChange}
          placeholder="Your email address"
          icon={IconAt}
          required
        />

        <AuthField
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          handleChange={handleChange}
          placeholder="Your password"
          icon={IconLock}
          required
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-fg/60 hover:text-fg transition-colors"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          }
        />

        {isSignUp && (
          <AuthField
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            handleChange={handleChange}
            placeholder="Confirm your password"
            icon={IconLock}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-fg/60 hover:text-fg transition-colors"
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={20} />
                ) : (
                  <IconEye size={20} />
                )}
              </button>
            }
          />
        )}

        {!isSignUp && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <div className="pt-4">
          <HoverBorderButton
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            <div className="text-fg flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-2 text-lg">
              <span
                className={`font-semibold ${isLoading ? "animate-pulse" : ""}`}
              >
                {isLoading
                  ? isSignUp
                    ? "Creating Account..."
                    : "Signing In..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </span>
              <div className="h-6 w-6">
                {isSignUp ? <IconUserPlus /> : <IconLogin />}
              </div>
            </div>
          </HoverBorderButton>
        </div>

        {(error || validationError) && (
          <div className="text-center text-sm text-red-400">
            {error || validationError}
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
