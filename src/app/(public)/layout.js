import "../globals.css";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "../../components/ui/lodaer";


export const metadata = {
  title: 'Green Bird',
  description: 'Green Bird - A social media handle',
  metadataBase: new URL('https://green-bird-xi.vercel.app/'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Green Bird',
    description: 'Green Bird - A social media handle',
    url: 'https://green-bird-xi.vercel.app/',
    siteName: 'Green Bird',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Bird',
    description: 'Green Bird - A social media handle',
    images: ['/og-image.png'],
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
