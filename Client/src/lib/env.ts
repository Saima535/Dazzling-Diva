import { z } from "zod";

const clientEnvSchema = z.object({
  BACKEND_API_URL: z.string().url("BACKEND_API_URL is required"),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL is required"),
  REVALIDATION_SECRET: z.string().min(1).optional(),
});

const parsed = clientEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid client environment: ${missing}`);
}

export const env = parsed.data;
