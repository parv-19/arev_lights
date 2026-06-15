import Link from "next/link";
import SectionReveal from "@/components/shared/SectionReveal";
import { Play } from "lucide-react";
import InstagramEmbed from "@/components/public/media/InstagramEmbed";
import {
  getYouTubeEmbedUrl,
  isInstagramUrl,
  isYouTubeUrl,
} from "@/lib/socialEmbeds";

interface IGlimpse {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: { url: string; publicId?: string };
  isVisible: boolean;
}

// Fallback glimpses shown when MongoDB is empty / no data yet
const FALLBACKS: IGlimpse[] = [
  { _id: "1", title: "Luxury Villa — Architectural Lighting", description: "Custom chandelier + accent lighting for a premium residential project.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isVisible: true },
  { _id: "2", title: "Commercial Space — Power Track Setup", description: "Track lighting installation for a retail showroom.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isVisible: true },
  { _id: "3", title: "Hotel Lobby — Decorative Lighting", description: "5-star hospitality lighting design with AREV curated brands.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", isVisible: true },
];

export default function GlimpsesSection({ glimpses: propGlimpses }: { glimpses?: IGlimpse[] }) {
  const glimpses = propGlimpses && propGlimpses.length > 0 ? propGlimpses : FALLBACKS;

  return (
    <section className="section-padding bg-primary border-y border-border">
      <div className="container-custom">
        <SectionReveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">Our Work</span>
            <div className="gold-line" />
          </div>
          <h2 className="heading-display">Project Glimpses</h2>
          <p className="text-muted mt-4 max-w-lg mx-auto">
            A peek into our lighting installations — from luxury villas and hotels to commercial spaces across India.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {glimpses.map((g, i) => (
            <SectionReveal key={g._id} delay={i * 0.08}>
              <div className="group mx-auto w-full max-w-[21rem] overflow-hidden rounded-2xl border border-border/80 bg-surface/95 hover:border-accent/30 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition-all duration-300">
                {/* Video */}
                <div
                  className={`relative overflow-hidden ${
                    isInstagramUrl(g.videoUrl) ? "bg-primary/70 px-3 pt-3 pb-2" : "aspect-video bg-surface-2"
                  }`}
                >
                  {isInstagramUrl(g.videoUrl) ? (
                    <InstagramEmbed url={g.videoUrl} title={g.title} />
                  ) : g.thumbnail?.url ? (
                    <a
                      href={g.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group block w-full h-full"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.thumbnail.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
                          <Play size={24} className="text-white ml-1 shadow-sm" />
                        </div>
                      </div>
                    </a>
                  ) : isYouTubeUrl(g.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(g.videoUrl)}
                      title={g.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={g.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-[15px] text-neutral leading-snug mb-2">{g.title}</h3>
                  {g.description && <p className="text-muted text-[11px] leading-relaxed line-clamp-4">{g.description}</p>}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal className="text-center mt-10">
          <Link href="/glimpses" className="btn-outline-gold">
            View All Glimpses
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
