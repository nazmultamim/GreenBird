import { SignUp } from "@clerk/nextjs";


const metadataBase = new URL('https://green-bird-xi.vercel.app/');
export const metadata = {
  title: 'Sign Up - Green Bird',
  description: 'Green Bird - A social media handle',
  metadataBase,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sign Up - Green Bird',
    description: 'Green Bird - A social media handle',
    url: metadataBase.toString(),
    siteName: 'Green Bird',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up - Green Bird',
    description: 'Green Bird - A social media handle',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

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