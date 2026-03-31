import type { Query, Schema } from "mongoose";
import { sanitizeUnknown } from "@/lib/security";

function sanitizeUpdate(this: Query<unknown, unknown>) {
  const update = this.getUpdate();
  if (!update) return;

  this.setUpdate(sanitizeUnknown(update));
}

export function applyStringSanitization(schema: Schema) {
  schema.pre("save", function sanitizeDocument(next) {
    const doc = this as { _doc?: Record<string, unknown> };
    if (doc._doc) {
      doc._doc = sanitizeUnknown(doc._doc);
    }
    next();
  });

  schema.pre("findOneAndUpdate", sanitizeUpdate);
  schema.pre("updateOne", sanitizeUpdate);
  schema.pre("updateMany", sanitizeUpdate);
}
