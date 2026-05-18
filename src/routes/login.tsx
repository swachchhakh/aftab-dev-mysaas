import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { signIn } from "@/lib/auth/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    console.log('Button clicked')
    setIsLoading(true);
    try {
      const callbackURL = redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
      const result = await signIn.social({ provider: "github", callbackURL });
      console.log("Result:", result);
    } catch (err) {
      console.error("Error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center space-y-2 text-center">
     
          <h1 className="text-2xl font-bold tracking-tight">My SaaS</h1>
          <p className="text-sm text-muted-foreground">
            Build something great.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
             type="button"  
              onClick={handleGitHubLogin}
            
              variant="outline"
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Loader2 className="h-4 w-4" />
              )}
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}