import Link from "next/link";
import SectionReveal from "@/components/shared/SectionReveal";
import { Play, ExternalLink } from "lucide-react";

interface IGlimpse {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: { url: string; publicId?: string };
  isVisible: boolean;
}

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  return url;
}

function isYouTube(url: string) { return /youtube\.com|youtu\.be/.test(url); }
function isInstagram(url: string) { return /instagram\.com/.test(url); }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {glimpses.map((g, i) => (
            <SectionReveal key={g._id} delay={i * 0.08}>
              <div className="group bg-surface border border-border rounded-sm overflow-hidden hover:border-border-light hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                {/* Video */}
                <div className="relative aspect-video bg-surface-2 overflow-hidden">
                  {g.thumbnail?.url ? (
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
                  ) : isYouTube(g.videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(g.videoUrl)}
                      title={g.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isInstagram(g.videoUrl) ? (
                    <a
                      href={g.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center h-full gap-3 bg-gradient-to-br from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 hover:from-[#833ab4]/30 hover:to-[#fcb045]/30 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Play size={22} className="text-white ml-1" />
                      </div>
                      <span className="text-muted text-xs flex items-center gap-1">Watch Instagram Reel <ExternalLink size={10} /></span>
                    </a>
                  ) : (
                    <video src={g.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-sm text-neutral leading-snug mb-1">{g.title}</h3>
                  {g.description && <p className="text-muted text-xs leading-relaxed">{g.description}</p>}
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
