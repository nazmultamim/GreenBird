import { SignIn } from "@clerk/nextjs";

const metadataBase = new URL('https://green-bird-xi.vercel.app/');
export const metadata = {
  title: 'Sign In - Green Bird',
  description: 'Green Bird - A social media handle',
  metadataBase,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sign In - Green Bird',
    description: 'Green Bird - A social media handle',
    url: metadataBase.toString(),
    siteName: 'Green Bird',
    images: [{ url: "/og-image.png", width: 1200, height: 630 },
    {
      url: "/og-image-small.jpg", // compressed JPG under 200KB for WhatsApp
      width: 600,
      height: 315,
    },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In - Green Bird',
    description: 'Green Bird - A social media handle',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

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