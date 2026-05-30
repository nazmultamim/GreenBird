import "../globals.css";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "../../components/ui/lodaer";

const metadataBase = new URL('https://green-bird-xi.vercel.app/');

export const metadata = {
  title: {
    default: 'Green Bird',
    template: '%s | Green Bird', // এটি প্রতিটি পেজের টাইটেল অটোমেটিক সেট করবে
  },
  description: 'Green Bird - A social media handle',
  metadataBase,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Green Bird',
    description: 'Green Bird - A social media handle',
    url: metadataBase.toString(),
    siteName: 'Green Bird',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Bird',
    description: 'Green Bird - A social media handle',
     images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html lang="en" className="h-full">
        <body className="antialiased">
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
