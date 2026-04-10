import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { redirectToUserHome } from "@/lib/auth/auth";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();

  if (session?.user) {
    redirectToUserHome(session.user.userType);
  }

  const { callbackUrl = "/dashboard" } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-lg py-4xl">
      <div className="grid w-full gap-2xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-lg">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Skill Forge
          </p>
          <div className="space-y-md">
            <h1 className="max-w-3xl font-heading text-5xl font-semibold text-text-strong">
              Sign in to continue your learning plan.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-text-soft">
              &ldquo;Education is not the filling of a pail, but the lighting of a fire.&rdquo;
            </p>
          </div>
        </section>
        <div className="flex justify-center lg:justify-end">
          <SignInForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}
