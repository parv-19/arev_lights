import Image from "next/image";
import Link from "next/link";
import SectionReveal from "@/components/shared/SectionReveal";
import { ArrowRight, MapPin } from "lucide-react";

const DUMMY_PROJECTS = [
  { _id: "1", title: "5-Star Hotel Lobby", location: "Mumbai", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=700&q=80" },
  { _id: "2", title: "Corporate HQ Atrium", location: "Pune", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80" },
  { _id: "3", title: "Luxury Villa Exterior", location: "Goa", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" },
  { _id: "4", title: "Retail Flagship Store", location: "Delhi", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=700&q=80" },
];

import { IProject } from "@/types";

export default function ProjectsShowcase({ projects: propProjects }: { projects?: IProject[] }) {
  const projects = propProjects?.length ? propProjects : DUMMY_PROJECTS as unknown as IProject[];
  return (
    <section className="section-padding bg-primary">
      <div className="container-custom">
        {/* Header */}
        <SectionReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Completed Installations</span>
            </div>
            <h2 className="heading-display">Our Signature Projects</h2>
          </div>
          <Link href="/projects" className="btn-outline-gold whitespace-nowrap">
            View All <ArrowRight size={15} />
          </Link>
        </SectionReveal>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large featured card */}
          <SectionReveal className="col-span-2 lg:col-span-1 row-span-2">
            <Link
              href="/projects"
              className="group relative flex overflow-hidden rounded-sm h-full min-h-[400px]"
            >
              <Image
                src={(projects[0] as any).image || projects[0].images?.[0]?.url || "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=700&q=80"}
                alt={projects[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={12} className="text-accent" />
                  <span className="text-accent font-label text-[10px] uppercase tracking-wider">{projects[0].location}</span>
                </div>
                <h3 className="font-display text-xl text-neutral group-hover:text-accent transition-colors duration-200">
                  {projects[0].title}
                </h3>
              </div>
            </Link>
          </SectionReveal>

          {/* Smaller cards */}
          {projects.slice(1).map((p, i) => (
            <SectionReveal key={p._id} delay={(i + 1) * 0.1}>
              <Link href="/projects" className="group relative flex overflow-hidden rounded-sm aspect-video">
                <Image
                  src={(p as any).image || p.images?.[0]?.url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={11} className="text-accent" />
                    <span className="text-accent font-label text-[9px] uppercase tracking-wider">{p.location}</span>
                  </div>
                  <h3 className="font-display text-base text-neutral group-hover:text-accent transition-colors duration-200">
                    {p.title}
                  </h3>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
