import AuthForm from "@/components/AuthForm";
import PageTitle from "@/components/PageTitle";

export const metadata = { title: "Sign in — Career Compass" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <PageTitle title="Sign in" subtitle="Save your results and build a shortlist. No password needed." />
      <AuthForm />
    </div>
  );
}
