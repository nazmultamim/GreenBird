import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: "#059669",
            colorBackground: "#0d2720",
            colorInputBackground: "#132e25",
            colorInputText: "#ffffff",
            colorText: "#ffffff",
            colorTextSecondary: "#86efac",
            borderRadius: "10px",
            fontSize: "15px",
          },
        }}
      />
    </main>
  );
}