import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main
      className="
        flex min-h-screen
        items-center justify-center
        px-4
      "
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-none",
          },
        }}
      />
    </main>
  );
}