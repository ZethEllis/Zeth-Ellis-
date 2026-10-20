import AuthForm from "@/components/AuthForm";
import PageTitle from "@/components/PageTitle";

export const metadata = { title: "Sign in — Career E-Sandbox" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <PageTitle title="Sign in" subtitle="Save your results and build a shortlist." />
      <AuthForm initialError={error ? `Sign-in didn't finish: ${error}` : undefined} />
    </div>
  );
}
