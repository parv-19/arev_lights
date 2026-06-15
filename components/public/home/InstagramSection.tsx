import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import InstagramEmbed from "@/components/public/media/InstagramEmbed";
import {
  getInstagramHandle,
  isInstagramUrl,
  normalizeInstagramUrl,
} from "@/lib/socialEmbeds";

interface IInstagramReel {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
}

export default function InstagramSection({
  instagramReels,
  instagramProfileUrl,
}: {
  instagramReels?: IInstagramReel[];
  instagramProfileUrl?: string;
}) {
  const reelMap = new Map<string, IInstagramReel>();

  (instagramReels || [])
    .filter((item) => item.videoUrl && isInstagramUrl(item.videoUrl))
    .forEach((item) => {
      const key = normalizeInstagramUrl(item.videoUrl);
      if (!reelMap.has(key)) {
        reelMap.set(key, item);
      }
    });

  const reels = Array.from(reelMap.values()).slice(0, 2);

  if (reels.length === 0) {
    return null;
  }

  const handle = getInstagramHandle(instagramProfileUrl);
  const hasProfileLink = Boolean(handle && instagramProfileUrl);
  const primaryHref = hasProfileLink
    ? instagramProfileUrl!
    : normalizeInstagramUrl(reels[0].videoUrl);

  return (
    <section className="section-padding bg-surface border-y border-border">
      <div className="container-custom">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <SectionReveal className="xl:sticky xl:top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">On Instagram</span>
            </div>

            <h2 className="heading-display mb-5">Watch AREV Reels Without Leaving the Site</h2>
            <p className="text-muted max-w-xl leading-relaxed">
              This section is powered by Instagram reel links added in the admin panel, so new client
              reels can go live on the homepage without another code change.
            </p>

            <div className="mt-8 border border-border bg-primary p-6 sm:p-7">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center mb-5">
                <Instagram size={22} className="text-white" />
              </div>

              <p className="font-display text-2xl text-neutral mb-2">
                {handle || "Instagram Highlights"}
              </p>
              <p className="text-muted text-sm leading-relaxed mb-6">
                {hasProfileLink
                  ? "Open the full Instagram profile to browse more reels, posts, and project updates."
                  : "The profile link is not configured yet, so this button opens the first live reel from the CMS."}
              </p>

              <Link
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold inline-flex items-center gap-2"
              >
                {hasProfileLink ? "Visit Instagram Profile" : "Open First Live Reel"}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </SectionReveal>

          <div className="grid gap-6 md:grid-cols-2">
            {reels.map((reel, index) => (
              <SectionReveal key={reel._id} delay={index * 0.08}>
                <div className="border border-border bg-primary p-3 sm:p-4">
                  <InstagramEmbed url={reel.videoUrl} title={reel.title} />

                  <div className="pt-4">
                    <h3 className="font-display text-lg text-neutral mb-2">{reel.title}</h3>
                    {reel.description && (
                      <p className="text-muted text-sm leading-relaxed">{reel.description}</p>
                    )}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
