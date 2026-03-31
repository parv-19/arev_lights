import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export type InquiryType = "general" | "dealer" | "product";
export type InquiryStatus = "new" | "contacted" | "converted";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  type: InquiryType;
  productRef?: mongoose.Types.ObjectId;
  status: InquiryStatus;
  // Additional dealer fields
  city?: string;
  state?: string;
  businessType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["general", "dealer", "product"], default: "general" },
    productRef: { type: Schema.Types.ObjectId, ref: "Product" },
    status: { type: String, enum: ["new", "contacted", "converted"], default: "new" },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    businessType: { type: String, trim: true },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1 });
InquirySchema.index({ type: 1 });
InquirySchema.index({ createdAt: -1 });
applyStringSanitization(InquirySchema);

export default mongoose.models.Inquiry ||
  mongoose.model<IInquiry>("Inquiry", InquirySchema);
