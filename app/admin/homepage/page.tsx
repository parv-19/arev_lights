"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/utils";
import { Eye, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
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

interface HomepageSectionResponse {
  success: boolean;
  data?: {
    data?: {
      banners?: HeroBannerData[];
    };
    isActive?: boolean;
  } | null;
  message?: string;
}

const createEmptyBanner = (): HeroBannerData => ({
  title: "",
  subtitle: "",
  imageUrl: "",
  imagePublicId: "",
  ctaLabel: "Explore Products",
  ctaHref: "/products",
  secondaryCtaLabel: "Download Brochure",
  secondaryCtaHref: "/brochures",
});

export default function AdminHomepagePage() {
  const [banners, setBanners] = useState<HeroBannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);

  const fetchHeroBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/homepage/hero_banners", { cache: "no-store" });
      const data: HomepageSectionResponse = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to load homepage slides");
        setBanners([createEmptyBanner()]);
        return;
      }

      const liveBanners = data.data?.data?.banners?.length
        ? data.data.data.banners
        : [createEmptyBanner()];

      setBanners(liveBanners);
      setIsActive(data.data?.isActive !== false);
    } catch {
      toast.error("Failed to load homepage slides");
      setBanners([createEmptyBanner()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  const handleBannerImageUpload = async (file: File, idx: number) => {
    setUploadingIdx(idx);
    try {
      const uploaded = await uploadFile(file, "arev-lights/hero-banners");
      setBanners((prev) =>
        prev.map((banner, i) =>
          i === idx
            ? {
                ...banner,
                imageUrl: uploaded.url,
                imagePublicId: uploaded.publicId,
              }
            : banner
        )
      );
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingIdx(null);
    }
  };

  const updateBanner = (idx: number, field: keyof HeroBannerData, value: string) => {
    setBanners((prev) =>
      prev.map((banner, i) => (i === idx ? { ...banner, [field]: value } : banner))
    );
  };

  const addBanner = () => {
    setBanners((prev) => [...prev, createEmptyBanner()]);
  };

  const removeBanner = (idx: number) => {
    setBanners((prev) => {
      if (prev.length === 1) return [createEmptyBanner()];
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSave = async () => {
    const cleanedBanners = banners.filter(
      (banner) =>
        banner.title.trim() ||
        banner.subtitle.trim() ||
        banner.imageUrl.trim() ||
        banner.ctaLabel.trim() ||
        banner.ctaHref.trim() ||
        banner.secondaryCtaLabel.trim() ||
        banner.secondaryCtaHref.trim()
    );

    if (cleanedBanners.length === 0) {
      toast.error("Add at least one slide before saving");
      return;
    }

    if (cleanedBanners.some((banner) => !banner.title.trim())) {
      toast.error("Each slide needs a headline");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/homepage/hero_banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { banners: cleanedBanners },
          isActive,
        }),
      });
      const data: HomepageSectionResponse = await res.json();

      if (data.success) {
        toast.success("Homepage slides saved");
        setBanners(cleanedBanners);
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-neutral text-xl font-semibold">Homepage CMS</h1>
          <p className="text-muted text-sm mt-1">
            Manage the live hero slider shown on the public homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHeroBanners}
            disabled={loading}
            className="flex items-center gap-2 border border-border px-4 py-2 text-xs text-muted hover:text-neutral transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Live Slides
          </button>
          <button
            onClick={addBanner}
            className="flex items-center gap-1.5 text-accent text-xs hover:text-accent-light border border-accent/30 px-3 py-2 rounded transition-colors"
          >
            <Plus size={13} /> Add Slide
          </button>
        </div>
      </div>

      <div className="admin-card flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-neutral font-semibold text-sm uppercase tracking-wider">Live Slider Status</h2>
          <p className="text-muted text-sm mt-1">
            {loading
              ? "Loading saved slides..."
              : `${banners.length} slide${banners.length !== 1 ? "s" : ""} ready for the homepage hero banner.`}
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-neutral">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-accent h-4 w-4"
          />
          Show hero slider on homepage
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="admin-card h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {banners.map((banner, idx) => (
            <div key={`${banner.imagePublicId || "slide"}-${idx}`} className="admin-card space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-muted text-xs font-label uppercase tracking-wider">
                    Slide {idx + 1}
                  </span>
                  {banner.title && (
                    <span className="text-xs text-accent inline-flex items-center gap-1">
                      <Eye size={12} /> Live Editable
                    </span>
                  )}
                </div>

                <button
                  onClick={() => removeBanner(idx)}
                  className="text-muted hover:text-danger transition-colors"
                  title="Delete slide"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div>
                <label className="admin-label">Background Image</label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {banner.imageUrl ? (
                    <div className="relative w-full sm:w-40 h-24 rounded overflow-hidden border border-border flex-shrink-0">
                      <Image src={banner.imageUrl} alt={banner.title || "banner"} fill className="object-cover" sizes="160px" />
                      <button
                        onClick={() => {
                          updateBanner(idx, "imageUrl", "");
                          updateBanner(idx, "imagePublicId", "");
                        }}
                        className="absolute top-1 right-1 bg-danger rounded-full p-1"
                        title="Remove image"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full sm:w-40 h-24 border-2 border-dashed border-border rounded flex items-center justify-center flex-shrink-0">
                      {uploadingIdx === idx ? (
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={16} className="text-muted" />
                      )}
                    </div>
                  )}

                  <label className="cursor-pointer btn-outline-gold text-xs py-2 px-4">
                    {uploadingIdx === idx ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingIdx !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerImageUpload(file, idx);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="admin-label">Headline *</label>
                  <input
                    className="admin-input"
                    value={banner.title}
                    onChange={(e) => updateBanner(idx, "title", e.target.value)}
                    placeholder="Illuminate Your World"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="admin-label">Sub-headline</label>
                  <textarea
                    className="admin-input resize-none h-20"
                    value={banner.subtitle}
                    onChange={(e) => updateBanner(idx, "subtitle", e.target.value)}
                    placeholder="Premium lighting for designers, architects, and builders."
                  />
                </div>

                <div>
                  <label className="admin-label">Primary CTA Label</label>
                  <input
                    className="admin-input"
                    value={banner.ctaLabel}
                    onChange={(e) => updateBanner(idx, "ctaLabel", e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label">Primary CTA Link</label>
                  <input
                    className="admin-input"
                    value={banner.ctaHref}
                    onChange={(e) => updateBanner(idx, "ctaHref", e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label">Secondary CTA Label</label>
                  <input
                    className="admin-input"
                    value={banner.secondaryCtaLabel}
                    onChange={(e) => updateBanner(idx, "secondaryCtaLabel", e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label">Secondary CTA Link</label>
                  <input
                    className="admin-input"
                    value={banner.secondaryCtaHref}
                    onChange={(e) => updateBanner(idx, "secondaryCtaHref", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-card bg-accent/5 border-accent/20">
        <p className="text-accent font-semibold text-sm mb-1">Homepage sections</p>
        <p className="text-muted text-xs">
          Other homepage sections like brochures, testimonials, and logos are still managed from their own admin modules.
        </p>
      </div>

      <button onClick={handleSave} disabled={saving || loading} className="btn-gold py-3 px-8 text-sm">
        {saving ? "Saving..." : "Save Homepage Slides"}
      </button>
    </div>
  );
}
