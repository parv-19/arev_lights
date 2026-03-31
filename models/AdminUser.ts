import mongoose, { Document, Schema } from "mongoose";
import { applyStringSanitization } from "@/lib/mongoose-sanitize";

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  failedLoginAttempts: number;
  lockUntil?: Date | null;
  lastFailedLoginAt?: Date | null;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastFailedLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

applyStringSanitization(AdminUserSchema);

export default mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
