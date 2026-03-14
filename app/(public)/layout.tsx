import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppCTA />
    </>
  );
}
