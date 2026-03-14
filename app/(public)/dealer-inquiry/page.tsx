"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Send, Store, TrendingUp, Users, Award, Globe } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone required"),
  company: z.string().min(2, "Company name required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  businessType: z.string().min(1, "Select your business type"),
  message: z.string().min(20, "Please describe your business in at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

const BUSINESS_TYPES = [
  "Electrical Retailer",
  "Lighting Showroom",
  "Interior Design Firm",
  "Architecture Studio",
  "Construction / Builder",
  "Project Contractor",
  "E-commerce Retailer",
  "Other",
];

const WHY_PARTNER = [
  { Icon: Store, title: "Premium Product Range", desc: "500+ curated products across all categories" },
  { Icon: TrendingUp, title: "Competitive Margins", desc: "Attractive dealer pricing with volume benefits" },
  { Icon: Users, title: "Dedicated Support", desc: "Assigned sales manager for each dealer" },
  { Icon: Award, title: "Brand Recognition", desc: "Partner with a trusted, established brand" },
  { Icon: Globe, title: "Pan-India Scope", desc: "Network across 15+ cities and growing" },
  { Icon: Send, title: "Fast Dispatch", desc: "Ready stock with 24-48 hour delivery" },
];

export default function DealerInquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "dealer" }),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        toast.success("Dealer inquiry submitted! We'll contact you within 24 hours.");
      } else {
        toast.error(result.message || "Submission failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 bg-primary">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="relative container-custom">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">B2B Partnership</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-display text-4xl lg:text-5xl text-neutral font-semibold leading-tight mb-5">
                  Become an<br />
                  <span className="gradient-text">Authorised Dealer</span>
                </h1>
                <p className="text-muted text-base leading-relaxed mb-6">
                  Join AREV Lights&apos; growing dealer network. Partner with one of India&apos;s most trusted lighting brands and give your customers access to a premium, certified product range.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["500+ Products", "Competitive Pricing", "Pan-India Support"].map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 text-xs font-label uppercase tracking-wider border border-accent/30 text-accent px-3 py-1.5">
                      ✦ {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Decorative Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50+", label: "Active Dealers" },
                  { value: "15+", label: "Cities" },
                  { value: "1000+", label: "Projects" },
                  { value: "15yr", label: "Experience" },
                ].map(s => (
                  <div key={s.label} className="border border-border bg-surface rounded-sm p-5 text-center">
                    <p className="font-display text-3xl gradient-text font-semibold">{s.value}</p>
                    <p className="text-muted text-xs font-label uppercase tracking-wide mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container-custom">
          <SectionReveal className="text-center mb-10">
            <h2 className="font-display text-2xl text-neutral">Why Partner with AREV Lights?</h2>
          </SectionReveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_PARTNER.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.07}>
                <div className="flex gap-3 p-4 border border-border rounded-sm hover:border-accent/30 hover:bg-primary/40 transition-all">
                  <div className="w-9 h-9 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <item.Icon size={15} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-neutral text-sm font-semibold mb-0.5">{item.title}</p>
                    <p className="text-muted text-xs">{item.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-primary">
        <div className="container-custom max-w-3xl">
          <SectionReveal>
            <h2 className="font-display text-3xl text-neutral mb-2">Dealer Application</h2>
            <p className="text-muted mb-8">Fill out the form below and our team will reach out within 24 business hours.</p>
          </SectionReveal>

          {submitted ? (
            <SectionReveal>
              <div className="border border-success/30 bg-success/5 rounded-sm p-10 text-center">
                <div className="w-16 h-16 border border-success/50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-success text-3xl">✓</span>
                </div>
                <h3 className="font-display text-2xl text-neutral mb-2">Application Received!</h3>
                <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in becoming an AREV Lights dealer. Our partnership team will review your application and contact you within 24 business hours.
                </p>
              </div>
            </SectionReveal>
          ) : (
            <SectionReveal>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-sm p-8 space-y-6">
                {/* Contact Details */}
                <div>
                  <h3 className="text-neutral font-semibold text-sm uppercase tracking-wider font-label mb-4 pb-3 border-b border-border">Contact Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Full Name *</label>
                      <input {...register("name")} className="admin-input" placeholder="Your name" />
                      {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="admin-label">Phone Number *</label>
                      <input {...register("phone")} className="admin-input" placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="admin-label">Email Address *</label>
                      <input {...register("email")} type="email" className="admin-input" placeholder="you@yourbusiness.com" />
                      {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <h3 className="text-neutral font-semibold text-sm uppercase tracking-wider font-label mb-4 pb-3 border-b border-border">Business Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="admin-label">Business / Company Name *</label>
                      <input {...register("company")} className="admin-input" placeholder="Your business name" />
                      {errors.company && <p className="text-danger text-xs mt-1">{errors.company.message}</p>}
                    </div>
                    <div>
                      <label className="admin-label">City *</label>
                      <input {...register("city")} className="admin-input" placeholder="Mumbai" />
                      {errors.city && <p className="text-danger text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="admin-label">State *</label>
                      <input {...register("state")} className="admin-input" placeholder="Maharashtra" />
                      {errors.state && <p className="text-danger text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="admin-label">Business Type *</label>
                      <select {...register("businessType")} className="admin-input">
                        <option value="">Select business type…</option>
                        {BUSINESS_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                      {errors.businessType && <p className="text-danger text-xs mt-1">{errors.businessType.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="admin-label">Tell us about your business *</label>
                      <textarea
                        {...register("message")}
                        className="admin-input resize-none h-28"
                        placeholder="Describe your business, current customer base, showroom size, monthly lighting sales volume, etc."
                      />
                      {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-gold w-full justify-center py-4 text-base">
                  {submitting ? "Submitting Application…" : <><Send size={16} /> Submit Dealer Application</>}
                </button>

                <p className="text-muted text-xs text-center leading-relaxed">
                  By submitting this form, you agree to be contacted by AREV Lights regarding your dealer application.
                </p>
              </form>
            </SectionReveal>
          )}
        </div>
      </section>
    </>
  );
}
