import mongoose, { Document, Schema } from "mongoose";

export interface IGlimpse extends Document {
  title: string;
  description?: string;
  videoUrl: string;       // YouTube / Instagram / direct video URL
  thumbnail?: { url: string; publicId: string };
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GlimpseSchema = new Schema<IGlimpse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true, trim: true },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Glimpse ||
  mongoose.model<IGlimpse>("Glimpse", GlimpseSchema);
