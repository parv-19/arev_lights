"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import SectionReveal from "@/components/shared/SectionReveal";
import { ISiteSettings } from "@/types";
import { buildWhatsAppLink } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.success) setSettings(d.data);
    });
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "general" }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Your message has been sent! We'll get back to you shortly.");
        reset();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to send. Please try again.");
    }
    setSubmitting(false);
  };

  const whatsappLink = buildWhatsAppLink(
    settings?.whatsappNumber || "911234567890",
    "Hello! I'd like to get in touch with AREV Lights. Please help me."
  );

  const phones = settings?.phones?.length ? settings.phones : ["+91 98765 43210"];
  const emails = settings?.emails?.length ? settings.emails : ["info@arevlights.com"];

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-14 bg-surface border-b border-border">
        <div className="container-custom text-center">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="section-label">Get In Touch</span>
              <div className="gold-line" />
            </div>
            <h1 className="heading-display mb-4">Contact AREV Lights</h1>
            <p className="text-muted max-w-xl mx-auto">
              Have a project in mind? Need a quote? We&apos;re here to help. Our team typically responds within 24 hours.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14">
            {/* Form */}
            <SectionReveal direction="left">
              <div className="bg-surface border border-border rounded-sm p-8">
                <h2 className="font-display text-2xl text-neutral mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Your Name *</label>
                      <input {...register("name")} className="admin-input" placeholder="Rajesh Kumar" />
                      {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="admin-label">Phone *</label>
                      <input {...register("phone")} className="admin-input" placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Email Address *</label>
                    <input {...register("email")} type="email" className="admin-input" placeholder="you@example.com" />
                    {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="admin-label">Company / Organization</label>
                    <input {...register("company")} className="admin-input" placeholder="Optional" />
                  </div>

                  <div>
                    <label className="admin-label">Your Message *</label>
                    <textarea {...register("message")} className="admin-input resize-none h-32" placeholder="Tell us about your project, requirements, or questions…" />
                    {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={submitting} className="btn-gold w-full justify-center py-4">
                    {submitting ? "Sending…" : <><Send size={15} /> Send Message</>}
                  </button>
                </form>
              </div>
            </SectionReveal>

            {/* Contact Details */}
            <SectionReveal direction="right">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-neutral mb-6">Contact Information</h2>
                  <div className="space-y-5">
                    {settings?.address && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} className="text-accent" />
                        </div>
                        <div>
                          <p className="admin-label mb-1">Address</p>
                          <p className="text-neutral text-sm leading-relaxed">{settings.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="w-10 h-10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <Phone size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="admin-label mb-1">Phone</p>
                        {phones.map(ph => (
                          <a key={ph} href={`tel:${ph}`} className="block text-neutral text-sm hover:text-accent transition-colors">
                            {ph}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <Mail size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="admin-label mb-1">Email</p>
                        {emails.map(em => (
                          <a key={em} href={`mailto:${em}`} className="block text-neutral text-sm hover:text-accent transition-colors">
                            {em}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="admin-label mb-1">Business Hours</p>
                        <p className="text-neutral text-sm">Mon – Sat: 10:00 AM – 7:00 PM</p>
                        <p className="text-muted text-xs mt-0.5">Sunday by appointment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 border border-[#25D366]/30 bg-[#25D366]/5 rounded-sm hover:bg-[#25D366]/10 transition-colors group"
                >
                  <MessageCircle size={24} className="text-[#25D366] flex-shrink-0" />
                  <div>
                    <p className="text-neutral font-semibold text-sm">Chat on WhatsApp</p>
                    <p className="text-muted text-xs mt-0.5">Get instant replies. Usually within minutes.</p>
                  </div>
                </a>

                {/* Map Embed */}
                {settings?.mapEmbedUrl && (
                  <div className="relative h-52 rounded-sm overflow-hidden border border-border">
                    <iframe
                      src={settings.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
