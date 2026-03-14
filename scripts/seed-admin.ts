import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env.local manually (no dotenv needed)
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}


// ─── Configurable Admin Credentials ──────────────────────────────────────────
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@arevlights.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Arev@Admin2025";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "AREV Admin";
// ─────────────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// Minimal AdminUser schema (mirrors models/AdminUser.ts)
const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function seedAdmin() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   AREV Lights — Admin User Seed Script");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    console.log("🔌  Connecting to MongoDB…");
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅  Connected to MongoDB\n");

    // Get or create the AdminUser model (safe if already registered)
    const AdminUser =
      mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

    // Check if admin with this email already exists
    const existing = await AdminUser.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      console.log(`⚠️   Admin user already exists:`);
      console.log(`    Email : ${existing.email}`);
      console.log(`    Name  : ${existing.name}`);
      console.log(`    Role  : ${existing.role}`);
      console.log("\n    No changes made. Seeding skipped.\n");
    } else {
      console.log("🔐  Hashing password…");
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

      console.log("💾  Creating admin user…");
      const admin = await AdminUser.create({
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        name: ADMIN_NAME,
        role: "admin",
      });

      console.log("\n🎉  Admin user created successfully!");
      console.log("─────────────────────────────────────");
      console.log(`    Email    : ${admin.email}`);
      console.log(`    Name     : ${admin.name}`);
      console.log(`    Role     : ${admin.role}`);
      console.log(`    Password : ${ADMIN_PASSWORD}`);
      console.log("─────────────────────────────────────");
      console.log("\n    ✅  You can now login at: http://localhost:3000/admin/login\n");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("\n❌  Seed failed:", error.message);
      if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
        console.error("    → Check your MONGODB_URI in .env.local\n");
      }
    } else {
      console.error("\n❌  Unknown error:", error);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB\n");
    process.exit(0);
  }
}

seedAdmin();
