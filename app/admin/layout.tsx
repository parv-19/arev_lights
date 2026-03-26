import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";
import SiteSettings from "@/models/SiteSettings";
import dbConnect from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await dbConnect();
  const settingsObj = await SiteSettings.findOne({}).lean();
  const settings = settingsObj ? JSON.parse(JSON.stringify(settingsObj)) : null;

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      <AdminSidebar settings={settings} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-primary p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
