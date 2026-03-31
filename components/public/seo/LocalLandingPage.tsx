import Link from "next/link";

type LandingPageProps = {
  heading: string;
  intro: string;
  highlights: readonly string[];
  keyword: string;
};

export default function LocalLandingPage({
  heading,
  intro,
  highlights,
  keyword,
}: LandingPageProps) {
  return (
    <>
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line" />
            <span className="section-label">Ahmedabad SEO Page</span>
            <div className="gold-line" />
          </div>
          <h1 className="heading-display mb-4">{heading}</h1>
          <p className="text-muted max-w-3xl mx-auto">
            {intro}
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div className="space-y-6">
            <div className="admin-card">
              <h2 className="font-display text-2xl text-neutral mb-4">
                Why Ahmedabad clients choose AREV Lights
              </h2>
              <p className="text-muted leading-relaxed">
                We work with homeowners, architects, interior designers, and project teams who need
                premium selections, practical guidance, and a refined showroom experience for{" "}
                {keyword.toLowerCase()} requirements in Ahmedabad.
              </p>
            </div>

            <div className="admin-card">
              <h2 className="font-display text-2xl text-neutral mb-4">What we help with</h2>
              <ul className="space-y-3 text-muted">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="admin-card">
              <h2 className="font-display text-2xl text-neutral mb-4">Visit our Ahmedabad team</h2>
              <p className="text-muted leading-relaxed">
                If you are comparing options for a new residence, renovation, showroom, office, or
                hospitality project, our team can help you narrow down the right fixtures, finishes,
                and performance requirements before you buy.
              </p>
            </div>
          </div>

          <aside className="admin-card space-y-4 sticky top-24">
            <h2 className="font-display text-2xl text-neutral">Plan your lighting visit</h2>
            <p className="text-muted text-sm leading-relaxed">
              Talk to the AREV Lights team about decorative lighting, smart controls, designer fans,
              and project-ready premium fixtures in Ahmedabad.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="btn-gold justify-center">
                Contact Our Team
              </Link>
              <Link href="/brochures" className="btn-outline-gold justify-center">
                Download Brochures
              </Link>
              <Link href="/" className="text-accent text-sm hover:text-accent-light transition-colors text-center">
                Explore AREV Lights Home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

