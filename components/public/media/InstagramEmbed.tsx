"use client";

import { useEffect } from "react";
import { normalizeInstagramUrl } from "@/lib/socialEmbeds";

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process: () => void;
    };
  };
};

const INSTAGRAM_EMBED_SCRIPT_ID = "instagram-embed-script";

function processInstagramEmbeds() {
  if (typeof window === "undefined") return;

  (window as InstagramWindow).instgrm?.Embeds?.process?.();
}

export default function InstagramEmbed({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const normalizedUrl = normalizeInstagramUrl(url);
  const permalink = `${normalizedUrl}?utm_source=ig_embed&utm_campaign=loading`;

  useEffect(() => {
    processInstagramEmbeds();

    const existingScript = document.getElementById(
      INSTAGRAM_EMBED_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", processInstagramEmbeds);
      return () => existingScript.removeEventListener("load", processInstagramEmbeds);
    }

    const script = document.createElement("script");
    script.id = INSTAGRAM_EMBED_SCRIPT_ID;
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.addEventListener("load", processInstagramEmbeds);
    document.body.appendChild(script);

    return () => script.removeEventListener("load", processInstagramEmbeds);
  }, [permalink]);

  return (
    <div className="w-full overflow-hidden rounded-sm border border-border bg-primary/60 p-2">
      <blockquote
        className="instagram-media mx-auto w-full !min-w-0 !max-w-full !bg-transparent"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: "transparent",
          border: 0,
          margin: 0,
          maxWidth: "100%",
          minWidth: 0,
          width: "100%",
        }}
      >
        <a
          href={normalizedUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} on Instagram`}
          className="text-sm text-accent underline underline-offset-4"
        >
          View this reel on Instagram
        </a>
      </blockquote>
    </div>
  );
}
