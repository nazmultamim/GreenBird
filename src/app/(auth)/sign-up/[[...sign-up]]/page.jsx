import { SignUp } from "@clerk/nextjs";


const BASE_URL = 'https://green-bird-xi.vercel.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const OG_IMAGE_SMALL = `${BASE_URL}/og-image-small.jpg`;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Sign Up - Green Bird',
  },
  description: 'Green Bird - A social media handle',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Sign Up - Green Bird',
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
    title: 'Sign Up - Green Bird',
    description: 'Green Bird - A social media handle',
    images: [OG_IMAGE],
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