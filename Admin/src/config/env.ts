import { z } from "zod";

const adminEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  Cloud_Name: z.string().min(1, "Cloud_Name is required"),
  Cloudinary_API_Key: z.string().min(1, "Cloudinary_API_Key is required"),
  Cloudinary_API_Secret: z
    .string()
    .min(1, "Cloudinary_API_Secret is required"),
  AUTH_JWT_SECRET: z.string().min(32, "AUTH_JWT_SECRET is required"),
  AUTH_REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "AUTH_REFRESH_TOKEN_SECRET is required"),
  CSRF_SECRET: z.string().min(32, "CSRF_SECRET is required"),
  CLIENT_ORIGIN: z.string().url("CLIENT_ORIGIN must be a valid URL"),
  ADMIN_ORIGIN: z.string().url("ADMIN_ORIGIN must be a valid URL"),
  CLIENT_INTERNAL_URL: z
    .string()
    .url("CLIENT_INTERNAL_URL must be a valid URL"),
  REVALIDATION_SECRET: z.string().min(32, "REVALIDATION_SECRET is required"),
  DEFAULT_TIMEZONE: z.string().default("Asia/Dhaka"),
  DEFAULT_CURRENCY: z.string().default("BDT"),
});

const parsed = adminEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid admin environment: ${missing}`);
}

export const env = parsed.data;
