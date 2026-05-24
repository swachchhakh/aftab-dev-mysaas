import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import "../styles/login.css"

import { signIn } from "@/lib/auth/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    console.log("Button clicked");
    setIsLoading(true);
    try {
      const callbackURL = redirectTo?.startsWith("/")
        ? redirectTo
        : "/dashboard";
      const result = await signIn.social({ provider: "github", callbackURL });
      console.log("Result:", result);
    } catch (err) {
      console.error("Error:", err);
      setIsLoading(false);
    }
  };

  return (
    <>
  

      <div className="login-root">
        <div className="login-wrapper">

          <div className="brand">
            <p className="brand-eyebrow">Platform</p>
            <h1 className="brand-name">Craft <em>SaaS</em></h1>
            <p className="brand-tagline">Build something great.</p>
            <div className="brand-rule">
              <div className="brand-rule-line" />
              <div className="brand-rule-dot" />
              <div className="brand-rule-line" />
            </div>
          </div>

          <div className="card">
            <p className="card-label">Authentication</p>
            <h2 className="card-title">Welcome back</h2>
            <p className="card-description">Sign in to your account to continue</p>

            <button
              type="button"
              className="github-btn"
              onClick={handleGitHubLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="btn-icon spin" size={14} />
              ) : (
                <svg className="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </button>

            <div className="divider" />

            <p className="legal">
              By signing in, you agree to our{" "}
              <a href="/terms">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}