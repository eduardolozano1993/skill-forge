import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-lg py-4xl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading">Sign in</CardTitle>
          <CardDescription>
            Placeholder auth route inside the <code className="font-mono">/(auth)</code>{" "}
            group. Replace this with your actual sign-in form or provider buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-md">
          <div className="rounded-md bg-surface-muted px-md py-sm text-sm text-text-soft">
            Route: <code className="font-mono">/sign-in</code>
          </div>
          <Button className="w-full">Continue</Button>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="px-0" asChild>
            <Link href="/">Back to marketing</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
