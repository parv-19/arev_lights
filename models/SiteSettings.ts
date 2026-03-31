import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export interface ISiteSettings extends Document {
  address: string;
  phones: string[];
  emails: string[];
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  mapEmbedUrl?: string;
  footerTagline?: string;
  showNavbar?: boolean;
  showWhyArev?: boolean;
  showProjects?: boolean;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    address: { type: String, default: "" },
    phones: [{ type: String }],
    emails: [{ type: String }],
    whatsappNumber: { type: String, default: "" },
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    mapEmbedUrl: { type: String, default: "" },
    footerTagline: { type: String, default: "Illuminating Spaces, Inspiring Lives." },
    showNavbar: { type: Boolean, default: true },
    showWhyArev: { type: Boolean, default: true },
    showProjects: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyStringSanitization(SiteSettingsSchema);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
