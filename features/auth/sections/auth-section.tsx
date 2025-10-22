"use client";

import Heading from "@/components/common/heading";
import { SectionContainer } from "@/components/layout/section";
import { SlideIn } from "@/components/ui/transitions";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";
import AuthForm from "../components/auth-form";

const AuthSection = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SectionContainer className="px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <SlideIn>
          <div className="mb-8 text-center">
            <div className="section-badge mx-auto mb-6">
              {isSignUp ? (
                <>
                  <IconUserPlus className="mr-2" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <IconLogin className="mr-2" />
                  <span>Welcome Back</span>
                </>
              )}
            </div>
            <Heading as="h1" className="mb-4">
              {isSignUp ? "Join Us" : "Sign In"}
            </Heading>
            <p className="text-fg/80 text-base">
              {isSignUp
                ? "Create your account to get started"
                : "Welcome back! Please sign in to your account"}
            </p>
          </div>
        </SlideIn>

        <SlideIn transition={{ duration: 0.5, delay: 0.4 }}>
          <AuthForm isSignUp={isSignUp} />
        </SlideIn>

        <SlideIn transition={{ duration: 0.5, delay: 0.5 }}>
          <div className="mt-8 text-center">
            <p className="text-fg/60 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary/80 ml-2 font-medium transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </SlideIn>
      </div>
    </SectionContainer>
  );
};

export default AuthSection;
