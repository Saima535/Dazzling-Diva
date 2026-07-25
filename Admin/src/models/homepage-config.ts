import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const homepageConfigSchema = new Schema(
  {
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroCtaLabel: { type: String, default: "Shop Now" },
    heroCtaHref: { type: String, default: "/shop" },
    flashDealTitle: { type: String, default: "" },
    flashDealEndsAt: Date,
    editorialTitle: { type: String, default: "" },
    editorialBody: { type: String, default: "" },
    festiveBannerTitle: { type: String, default: "" },
    festiveBannerBody: { type: String, default: "" },
    festiveBannerCtaLabel: { type: String, default: "Shop Now" },
    festiveBannerCtaHref: { type: String, default: "/shop" },
  },
  { timestamps: true },
);

export type HomePageConfig = InferSchemaType<typeof homepageConfigSchema>;

export const HomePageConfigModel =
  (models.HomePageConfig as Model<HomePageConfig>) ||
  model<HomePageConfig>("HomePageConfig", homepageConfigSchema);
