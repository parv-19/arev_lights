import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/shared/SessionWrapper";
import StructuredData from "@/components/shared/StructuredData";
import { getSiteUrl } from "@/lib/env";
import { buildMetadata, getGlobalSchemas } from "@/lib/seo";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AREV Lights Ahmedabad | Premium Decorative and Smart Lighting",
    description:
      "AREV Lights Ahmedabad offers premium decorative lights, designer fans, smart lighting solutions, and curated fixtures for elegant residential and commercial spaces.",
    path: "/",
    keywords: [
      "AREV Lights Ahmedabad",
      "lighting store Ahmedabad",
      "decorative lights Ahmedabad",
      "smart lighting Ahmedabad",
      "designer fans Ahmedabad",
    ],
  }),
  metadataBase: new URL(siteUrl),
  title: {
    default: "AREV Lights Ahmedabad | Premium Decorative and Smart Lighting",
    template: "%s | AREV Lights",
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
        <StructuredData data={getGlobalSchemas()} />
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
