import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export interface ISpec {
  key: string;
  value: string;
}

export interface IProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  images: IProductImage[];
  category: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  specs: ISpec[];
  tags: string[];
  brochure?: mongoose.Types.ObjectId;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDesc: { type: String, default: "" },
    description: { type: String, default: "" },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    specs: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    tags: [{ type: String }],
    brochure: { type: Schema.Types.ObjectId, ref: "Brochure" },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoImage: { type: String, default: "" },
  },
  { timestamps: true }
);


ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ title: "text", tags: "text" });
applyStringSanitization(ProductSchema);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
