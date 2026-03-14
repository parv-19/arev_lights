import mongoose, { Document, Schema } from "mongoose";

export interface ISeoMetadata extends Document {
  pageKey: string;
  pageLabel: string;
  title: string;
  description: string;
  ogImage?: { url: string; publicId: string };
  canonical?: string;
  updatedAt: Date;
}

const SeoMetadataSchema = new Schema<ISeoMetadata>(
  {
    pageKey: { type: String, required: true, unique: true, lowercase: true },
    pageLabel: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    ogImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    canonical: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SeoMetadata ||
  mongoose.model<ISeoMetadata>("SeoMetadata", SeoMetadataSchema);
