import "./globals.css";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "../components/ui/lodaer";

const BASE_URL = 'https://green-bird-xi.vercel.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const OG_IMAGE_SMALL = `${BASE_URL}/og-image-small.jpg`;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Green Bird',
    template: '%s | Green Bird',
  },
  description: 'Green Bird - A social media handle',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Green Bird',
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
    title: 'Green Bird',
    description: 'Green Bird - A social media handle',
    images: [OG_IMAGE],
  },
};


export default function RootLayout({ children }) {
  return (

    <html lang="en" className="h-full">
      <body className="antialiased">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/"
        >
          <ClerkLoading>
            <Loader />
          </ClerkLoading>

          <ClerkLoaded>
            {children}
          </ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>

  );
}
