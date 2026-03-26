"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ISiteSettings } from "@/types";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    address: "", phones: [""], emails: [""], whatsappNumber: "",
    footerTagline: "", mapEmbedUrl: "",
    socialLinks: { instagram: "", facebook: "", linkedin: "", youtube: "", twitter: "" },
    showNavbar: true,
    showWhyArev: true,
    showProjects: true,
  });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const s = d.data;
        setForm({
          address: s.address || "",
          phones: s.phones?.length ? s.phones : [""],
          emails: s.emails?.length ? s.emails : [""],
          whatsappNumber: s.whatsappNumber || "",
          footerTagline: s.footerTagline || "",
          mapEmbedUrl: s.mapEmbedUrl || "",
          socialLinks: { instagram: s.socialLinks?.instagram || "", facebook: s.socialLinks?.facebook || "", linkedin: s.socialLinks?.linkedin || "", youtube: s.socialLinks?.youtube || "", twitter: s.socialLinks?.twitter || "" },
          showNavbar: s.showNavbar ?? true,
          showWhyArev: s.showWhyArev ?? true,
          showProjects: s.showProjects ?? true,
        });
        setSettings(d.data);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const cleanForm = { ...form, phones: form.phones.filter(Boolean), emails: form.emails.filter(Boolean) };
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cleanForm) });
    const data = await res.json();
    if (data.success) toast.success("Settings saved!");
    else toast.error("Failed to save");
    setSaving(false);
  };

  const addPhone = () => setForm(f => ({ ...f, phones: [...f.phones, ""] }));
  const removePhone = (i: number) => setForm(f => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));
  const addEmail = () => setForm(f => ({ ...f, emails: [...f.emails, ""] }));
  const removeEmail = (i: number) => setForm(f => ({ ...f, emails: f.emails.filter((_, idx) => idx !== i) }));

  if (loading) return <div className="flex items-center justify-center h-64 text-muted">Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-neutral text-xl font-semibold">Contact & Company Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* UI Visibility Settings */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm">UI Visibility Settings</h2>
          
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="admin-label mb-0">Show Navbar</p>
              <p className="text-muted text-xs">Toggle the top navigation bar visibility across the public site.</p>
            </div>
            <button type="button" onClick={() => setForm(f => ({ ...f, showNavbar: !f.showNavbar }))}>
              {form.showNavbar ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-border py-4">
            <div>
              <p className="admin-label mb-0">Show &quot;Why AREV&quot; (What) Section</p>
              <p className="text-muted text-xs">Toggle the &quot;What we do / Why AREV&quot; section on the homepage.</p>
            </div>
            <button type="button" onClick={() => setForm(f => ({ ...f, showWhyArev: !f.showWhyArev }))}>
              {form.showWhyArev ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>

          {/* <div className="flex items-center justify-between pt-2">
            <div>
              <p className="admin-label mb-0">Show Projects Module</p>
              <p className="text-muted text-xs">Toggle the entire Projects system (hides nav links and homepage section).</p>
            </div>
            <button type="button" onClick={() => setForm(f => ({ ...f, showProjects: !f.showProjects }))}>
              {form.showProjects ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div> */}
        </div>

        {/* Address */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm">Company Details</h2>
          <div>
            <label className="admin-label">Address</label>
            <textarea className="admin-input resize-none h-20" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">Footer Tagline</label>
            <input className="admin-input" value={form.footerTagline} onChange={(e) => setForm(f => ({ ...f, footerTagline: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">WhatsApp Number (with country code)</label>
            <input className="admin-input" value={form.whatsappNumber} onChange={(e) => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} placeholder="919274776616" />
          </div>
        </div>

        {/* Phones */}
        <div className="admin-card space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-neutral font-medium text-sm">Phone Numbers</h2><button type="button" onClick={addPhone} className="text-accent text-xs flex items-center gap-1 hover:text-accent-light"><Plus size={12} /> Add</button></div>
          {form.phones.map((ph, i) => (
            <div key={i} className="flex gap-2"><input className="admin-input flex-1" value={ph} onChange={(e) => { const p = [...form.phones]; p[i] = e.target.value; setForm(f => ({ ...f, phones: p })); }} placeholder="+91…" /><button type="button" onClick={() => removePhone(i)} className="text-muted hover:text-danger transition-colors"><Trash2 size={14} /></button></div>
          ))}
        </div>

        {/* Emails */}
        <div className="admin-card space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-neutral font-medium text-sm">Email Addresses</h2><button type="button" onClick={addEmail} className="text-accent text-xs flex items-center gap-1 hover:text-accent-light"><Plus size={12} /> Add</button></div>
          {form.emails.map((em, i) => (
            <div key={i} className="flex gap-2"><input className="admin-input flex-1" value={em} onChange={(e) => { const p = [...form.emails]; p[i] = e.target.value; setForm(f => ({ ...f, emails: p })); }} placeholder="info@…" /><button type="button" onClick={() => removeEmail(i)} className="text-muted hover:text-danger transition-colors"><Trash2 size={14} /></button></div>
          ))}
        </div>

        {/* Social Links */}
        <div className="admin-card space-y-4">
          <h2 className="text-neutral font-medium text-sm">Social Links</h2>
          {(["instagram", "facebook", "linkedin", "youtube", "twitter"] as const).map((key) => (
            <div key={key}>
              <label className="admin-label capitalize">{key}</label>
              <input className="admin-input" type="url" value={form.socialLinks[key]} onChange={(e) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } }))} placeholder="https://…" />
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="admin-card">
          <label className="admin-label">Google Map Embed URL</label>
          <input className="admin-input" value={form.mapEmbedUrl} onChange={(e) => setForm(f => ({ ...f, mapEmbedUrl: e.target.value }))} placeholder="https://maps.google.com/maps?…" />
        </div>

        <button type="submit" disabled={saving} className="btn-gold py-3 px-8 text-sm">
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
