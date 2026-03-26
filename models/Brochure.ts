import mongoose, { Document, Schema } from "mongoose";

export interface IBrochure extends Document {
  title: string;
  category?: mongoose.Types.ObjectId;
  pdfUrl?: string;
  pdfPublicId?: string;
  previewImage: { url: string; publicId: string };
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrochureSchema = new Schema<IBrochure>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    pdfUrl: { type: String, default: "" },
    pdfPublicId: { type: String, default: "" },
    previewImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Brochure ||
  mongoose.model<IBrochure>("Brochure", BrochureSchema);
