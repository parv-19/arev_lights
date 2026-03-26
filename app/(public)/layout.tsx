import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";

async function getSettings() {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (e) {
    return null;
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      {settings?.showNavbar !== false && <Navbar settings={settings} />}
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <WhatsAppCTA settings={settings} />
    </>
  );
}
