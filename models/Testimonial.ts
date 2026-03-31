import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export interface ITestimonial extends Document {
  clientName: string;
  designation?: string;
  company?: string;
  reviewText: string;
  image?: { url: string; publicId: string };
  rating: number;
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    company: { type: String, default: "" },
    reviewText: { type: String, required: true },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

applyStringSanitization(TestimonialSchema);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
