import { z } from "zod";

import { recordAudit } from "@/lib/audit";
import { connectToDatabase } from "@/lib/db";
import { HomePageConfigModel } from "@/models/homepage-config";
import { SiteSettingsModel } from "@/models/site-settings";

export const homepageInputSchema = z.object({
  heroTitle: z.string().default(""),
  heroSubtitle: z.string().default(""),
  heroCtaLabel: z.string().default("Shop Now"),
  heroCtaHref: z.string().default("/shop"),
  flashDealTitle: z.string().default(""),
  flashDealEndsAt: z.string().optional().default(""),
  editorialTitle: z.string().default(""),
  editorialBody: z.string().default(""),
  festiveBannerTitle: z.string().default(""),
  festiveBannerBody: z.string().default(""),
  festiveBannerCtaLabel: z.string().default("Shop Now"),
  festiveBannerCtaHref: z.string().default("/shop"),
});

export const settingsInputSchema = z.object({
  storeName: z.string().default("Dazzling Diva"),
  supportEmail: z.string().default(""),
  supportPhone: z.string().default(""),
  footerTagline: z.string().default(""),
  aboutPage: z.string().default(""),
  contactPage: z.string().default(""),
  faqPage: z.string().default(""),
  termsPage: z.string().default(""),
  privacyPage: z.string().default(""),
  refundPolicyPage: z.string().default(""),
});

export async function upsertHomepage(input: z.input<typeof homepageInputSchema>) {
  const values = homepageInputSchema.parse(input);
  await connectToDatabase();
  const homepage = await HomePageConfigModel.findOneAndUpdate(
    {},
    {
      ...values,
      flashDealEndsAt: values.flashDealEndsAt
        ? new Date(values.flashDealEndsAt)
        : undefined,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  await recordAudit({
    action: "homepage.updated",
    entityType: "homepage",
    entityId: String(homepage?._id ?? "homepage"),
    summary: values.heroTitle,
  });
  return homepage;
}

export async function upsertSettings(input: z.input<typeof settingsInputSchema>) {
  const values = settingsInputSchema.parse(input);
  await connectToDatabase();
  const settings = await SiteSettingsModel.findOneAndUpdate({}, values, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  await recordAudit({
    action: "settings.updated",
    entityType: "settings",
    entityId: String(settings?._id ?? "settings"),
    summary: values.storeName,
  });
  return settings;
}
