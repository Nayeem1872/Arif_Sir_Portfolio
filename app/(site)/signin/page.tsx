import AuthSection from "@/features/auth/sections/auth-section";
import { getMetadata } from "@/utils/meta";
import { Metadata } from "next";

export const metadata: Metadata = getMetadata({
  title: "Sign In | Portfolio",
  description: "Sign in to access your account",
});

const SignInPage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <AuthSection />
    </div>
  );
};

export default SignInPage;
