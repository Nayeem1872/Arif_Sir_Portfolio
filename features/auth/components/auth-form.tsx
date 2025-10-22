"use client";

import { HoverBorderButton } from "@/components/ui/hover-button";
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
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // Basic validation
    if (!form.email || !form.password) {
      setStatus("error");
      return;
    }

    if (isSignUp && (!form.name || form.password !== form.confirmPassword)) {
      setStatus("error");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      console.log("Form submitted:", form);
    }, 1500);
  };

  return (
    <div className="bg-card/50 border-border rounded-lg border p-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <AuthField
            name="name"
            type="text"
            value={form.name}
            handleChange={handleChange}
            placeholder="Your full name"
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
          <HoverBorderButton type="submit" className="w-full">
            <div className="text-fg flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-2 text-lg">
              <span
                className={`font-semibold ${
                  status === "submitting" ? "animate-pulse" : ""
                }`}
              >
                {status === "submitting"
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

        {status === "error" && (
          <div className="text-center text-sm text-red-400">
            {isSignUp
              ? "Please fill all fields and ensure passwords match"
              : "Invalid email or password"}
          </div>
        )}

        {status === "success" && (
          <div className="text-primary text-center text-sm">
            {isSignUp ? "Account created successfully!" : "Welcome back!"}
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
