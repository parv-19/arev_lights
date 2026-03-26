import Navbar from "@/components/public/layout/Navbar";
import Footer from "@/components/public/layout/Footer";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

async function getSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch {
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
