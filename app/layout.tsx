import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/shared/SessionWrapper";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AREV Lights – Premium Lighting Solutions",
    template: "%s | AREV Lights",
  },
  description:
    "Discover AREV Lights – your trusted partner for premium architectural and decorative lighting solutions across India.",
  keywords: ["AREV Lights", "premium lighting", "architectural lighting", "decorative lights", "LED lighting India"],
  openGraph: {
    title: "AREV Lights – Premium Lighting Solutions",
    description: "Premium architectural and decorative lighting brand.",
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "AREV Lights",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-primary text-neutral font-body antialiased">
        <SessionWrapper>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                color: "#F5F0EB",
                border: "1px solid #2E2E2E",
                borderRadius: "8px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#C9A84C", secondary: "#0A0A0A" },
              },
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  );
}
