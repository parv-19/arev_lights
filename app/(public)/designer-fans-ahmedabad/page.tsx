import type { Metadata } from "next";
import LocalLandingPage from "@/components/public/seo/LocalLandingPage";
import { buildMetadata, localLandingPages } from "@/lib/seo";

const page = localLandingPages.find((item) => item.slug === "designer-fans-ahmedabad")!;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: `/${page.slug}`,
  keywords: [...page.keywords, "AREV Lights Ahmedabad"],
});

export default function DesignerFansAhmedabadPage() {
  return <LocalLandingPage heading={page.heading} intro={page.intro} highlights={page.highlights} keyword={page.heading} />;
}
