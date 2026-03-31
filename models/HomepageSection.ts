import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export type SectionKey =
  | "hero_banners"
  | "featured_categories"
  | "why_arev"
  | "featured_products"
  | "partner_logos"
  | "projects_showcase"
  | "brochures"
  | "testimonials"
  | "inquiry_cta";

export interface IHomepageSection extends Document {
  sectionKey: SectionKey;
  label: string;
  data: mongoose.Schema.Types.Mixed;
  isActive: boolean;
  updatedAt: Date;
}

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "hero_banners",
        "featured_categories",
        "why_arev",
        "featured_products",
        "partner_logos",
        "projects_showcase",
        "brochures",
        "testimonials",
        "inquiry_cta",
      ],
    },
    label: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyStringSanitization(HomepageSectionSchema);

export default mongoose.models.HomepageSection ||
  mongoose.model<IHomepageSection>("HomepageSection", HomepageSectionSchema);
