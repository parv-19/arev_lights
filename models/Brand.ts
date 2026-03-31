import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export interface IBrand extends Document {
  name: string;
  logo: { url: string; publicId: string };
  websiteUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    websiteUrl: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

applyStringSanitization(BrandSchema);

export default mongoose.models.Brand ||
  mongoose.model<IBrand>("Brand", BrandSchema);
