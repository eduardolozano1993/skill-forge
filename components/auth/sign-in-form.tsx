"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { authenticate, type SignInFormState } from "@/app/(auth)/sign-in/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SignInFormProps = {
  callbackUrl: string;
};

const initialState: SignInFormState = {};

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const [state, formAction] = useActionState(authenticate, initialState);

  return (
    <Card className="w-full max-w-md border-border bg-surface/95 text-text-strong shadow-card backdrop-blur">
      <CardHeader className="space-y-sm text-center">
        <CardTitle className="font-heading text-3xl text-text-strong">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-md">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-xs">
            <label className="text-sm font-medium text-text-strong" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@skillforge.com"
              required
            />
          </div>
          <div className="space-y-xs">
            <label className="text-sm font-medium text-text-strong" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>
          {state.error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <div className="pt-sm">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <Link
          href="/"
          className="text-sm font-medium text-text-soft underline underline-offset-4 transition-colors hover:text-text-strong"
        >
          Back to home
        </Link>
      </CardFooter>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
