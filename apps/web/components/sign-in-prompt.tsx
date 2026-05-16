import { Hero } from "@workspace/ui/kit";
import { SignInWithGitHub } from "@/components/sign-in-with-github";
import { DevSignIn } from "@/components/dev-sign-in";

type Intent = "signup" | "submit" | "dashboard";

type Props = {
  intent: Intent;
  next: string;
};

const COPY: Record<Intent, { headline: string; sub: string }> = {
  signup: {
    headline: "sign in to start.",
    sub: "GitHub auth required. We use it as your stable identity for payouts and to dedupe builder profiles.",
  },
  submit: {
    headline: "sign in to submit.",
    sub: "GitHub auth required to submit a mini-app. Sign in to continue.",
  },
  dashboard: {
    headline: "sign in to continue.",
    sub: "Your builder profile, submissions, and weekly numbers live behind GitHub auth.",
  },
};

export function SignInPrompt({ intent, next }: Props) {
  const { headline, sub } = COPY[intent];
  return (
    <>
      <Hero size="lg" sub={sub}>
        {headline}
      </Hero>
      <div className="mt-7">
        <SignInWithGitHub next={next} />
      </div>
      <DevSignIn next={next} />
    </>
  );
}
