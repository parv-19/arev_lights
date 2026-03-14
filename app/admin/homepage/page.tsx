"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/utils";
import { Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";

interface HeroBannerData {
  title: string;
  subtitle: string;
  imageUrl: string;
  imagePublicId: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

const DEFAULT_BANNER: HeroBannerData = {
  title: "", subtitle: "", imageUrl: "", imagePublicId: "",
  ctaLabel: "Explore Products", ctaHref: "/products",
  secondaryCtaLabel: "Download Brochure", secondaryCtaHref: "/brochures",
};

export default function AdminHomepagePage() {
  const [banners, setBanners] = useState<HeroBannerData[]>([DEFAULT_BANNER]);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const handleBannerImageUpload = async (file: File, idx: number) => {
    setUploadingIdx(idx);
    try {
      const r = await uploadFile(file, "arev-lights/hero-banners");
      setBanners(prev => prev.map((b, i) => i === idx ? { ...b, imageUrl: r.url, imagePublicId: r.publicId } : b));
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed"); }
    setUploadingIdx(null);
  };

  const updateBanner = (idx: number, field: keyof HeroBannerData, value: string) => {
    setBanners(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const addBanner = () => setBanners(prev => [...prev, { ...DEFAULT_BANNER }]);
  const removeBanner = (idx: number) => setBanners(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/homepage/hero_banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { banners }, isActive: true }),
    });
    const data = await res.json();
    if (data.success) toast.success("Homepage banners saved!");
    else toast.error("Failed to save");
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-neutral text-xl font-semibold">Homepage CMS</h1>
        <p className="text-muted text-sm mt-1">Manage the hero banner carousel on the homepage.</p>
      </div>

      {/* Hero Banners */}
      <div className="admin-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-neutral font-semibold text-sm uppercase tracking-wider">Hero Banners</h2>
          <button onClick={addBanner} className="flex items-center gap-1.5 text-accent text-xs hover:text-accent-light border border-accent/30 px-3 py-1.5 rounded transition-colors">
            <Plus size={13} /> Add Slide
          </button>
        </div>

        {banners.map((banner, idx) => (
          <div key={idx} className="border border-border rounded-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted text-xs font-label uppercase tracking-wider">Slide {idx + 1}</span>
              {banners.length > 1 && (
                <button onClick={() => removeBanner(idx)} className="text-muted hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <label className="admin-label">Background Image</label>
              <div className="flex items-center gap-4">
                {banner.imageUrl ? (
                  <div className="relative w-32 h-20 rounded overflow-hidden border border-border flex-shrink-0">
                    <Image src={banner.imageUrl} alt="banner" fill className="object-cover" sizes="128px" />
                    <button onClick={() => updateBanner(idx, "imageUrl", "")} className="absolute top-1 right-1 bg-danger rounded-full p-0.5">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-20 border-2 border-dashed border-border rounded flex items-center justify-center flex-shrink-0">
                    {uploadingIdx === idx ? (
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={16} className="text-muted" />
                    )}
                  </div>
                )}
                <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                  {uploadingIdx === idx ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/*" disabled={uploadingIdx !== null} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerImageUpload(f, idx); }} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="admin-label">Headline *</label><input className="admin-input" value={banner.title} onChange={(e) => updateBanner(idx, "title", e.target.value)} placeholder="Illuminate Your World" /></div>
              <div className="col-span-2"><label className="admin-label">Sub-headline</label><textarea className="admin-input resize-none h-16" value={banner.subtitle} onChange={(e) => updateBanner(idx, "subtitle", e.target.value)} placeholder="Premium lighting for…" /></div>
              <div><label className="admin-label">Primary CTA Label</label><input className="admin-input" value={banner.ctaLabel} onChange={(e) => updateBanner(idx, "ctaLabel", e.target.value)} /></div>
              <div><label className="admin-label">Primary CTA Link</label><input className="admin-input" value={banner.ctaHref} onChange={(e) => updateBanner(idx, "ctaHref", e.target.value)} /></div>
              <div><label className="admin-label">Secondary CTA Label</label><input className="admin-input" value={banner.secondaryCtaLabel} onChange={(e) => updateBanner(idx, "secondaryCtaLabel", e.target.value)} /></div>
              <div><label className="admin-label">Secondary CTA Link</label><input className="admin-input" value={banner.secondaryCtaHref} onChange={(e) => updateBanner(idx, "secondaryCtaHref", e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card bg-accent/5 border-accent/20">
        <p className="text-accent font-semibold text-sm mb-1">More sections coming</p>
        <p className="text-muted text-xs">Featured categories, products, and testimonials shown on the homepage are managed via their respective admin modules with the &quot;Featured&quot; or &quot;Visible&quot; toggles.</p>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-gold py-3 px-8 text-sm">
        {saving ? "Saving…" : "Save Homepage Banners"}
      </button>
    </div>
  );
}
