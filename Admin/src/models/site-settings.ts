import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    storeName: { type: String, default: "Dazzling Diva" },
    supportEmail: { type: String, default: "" },
    supportPhone: { type: String, default: "" },
    aboutPage: { type: String, default: "" },
    contactPage: { type: String, default: "" },
    faqPage: { type: String, default: "" },
    termsPage: { type: String, default: "" },
    privacyPage: { type: String, default: "" },
    refundPolicyPage: { type: String, default: "" },
    footerTagline: { type: String, default: "" },
  },
  { timestamps: true },
);

export type SiteSettings = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettingsModel =
  (models.SiteSettings as Model<SiteSettings>) ||
  model<SiteSettings>("SiteSettings", siteSettingsSchema);
