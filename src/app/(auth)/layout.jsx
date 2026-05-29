import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Loader from "../../components/ui/lodaer";
import "../globals.css";




export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="antialiased">
        <body>
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