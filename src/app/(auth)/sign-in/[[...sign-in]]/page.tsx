import { SignIn } from "@clerk/nextjs";


export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const BASE_URL = 'https://green-bird-xi.vercel.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const OG_IMAGE_SMALL = `${BASE_URL}/og-image-small.jpg`;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Sign In - Green Bird',
  },
  description: 'Green Bird - A social media handle',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sign In - Green Bird',
    description: 'Green Bird - A social media handle',
    url: BASE_URL,
    siteName: 'Green Bird',
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: 'Green Bird' },
      { url: OG_IMAGE_SMALL, width: 600, height: 315, alt: 'Green Bird' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In - Green Bird',
    description: 'Green Bird - A social media handle',
    images: [OG_IMAGE],
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