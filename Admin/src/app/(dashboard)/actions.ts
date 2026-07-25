"use server";

import { revalidatePath } from "next/cache";

import { clearAdminSession } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { deleteImageFromCloudinary, getCloudinaryFolder, uploadImageToCloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { MediaAssetModel } from "@/models/media-asset";
import { createAdminUser } from "@/modules/admin-users/service";
import {
  createCategory,
  createCollection,
  createProduct,
} from "@/modules/catalog/service";
import { upsertHomepage, upsertSettings } from "@/modules/content/service";
import { createCoupon } from "@/modules/coupons/service";
import { createShippingMethod, updateOrderStatus } from "@/modules/orders/service";
import { setReviewStatus } from "@/modules/reviews/service";

export async function logoutAction() {
  await clearAdminSession();
}

export async function createCategoryAction(formData: FormData) {
  await createCategory({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    status: (formData.get("status") as "draft" | "published" | null) ?? "draft",
  });
  revalidatePath("/dashboard/categories");
}

export async function createCollectionAction(formData: FormData) {
  await createCollection({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    status: (formData.get("status") as "draft" | "published" | null) ?? "draft",
  });
  revalidatePath("/dashboard/collections");
}

export async function createProductAction(formData: FormData) {
  await createProduct({
    name: String(formData.get("name") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    material: String(formData.get("material") ?? ""),
    careInstructions: String(formData.get("careInstructions") ?? ""),
    heroImageUrl: String(formData.get("heroImageUrl") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    collectionIds: formData.getAll("collectionIds").map(String),
    status:
      (formData.get("status") as "draft" | "published" | "archived" | null) ??
      "draft",
    featured: formData.get("featured") === "on",
    newArrival: formData.get("newArrival") === "on",
    mostLoved: formData.get("mostLoved") === "on",
    variantSku: String(formData.get("variantSku") ?? ""),
    variantSize: String(formData.get("variantSize") ?? ""),
    variantColor: String(formData.get("variantColor") ?? ""),
    variantPriceMinor: Number(formData.get("variantPriceMinor") ?? 0),
    variantCompareAtPriceMinor: Number(
      formData.get("variantCompareAtPriceMinor") ?? 0,
    ),
    variantStockQuantity: Number(formData.get("variantStockQuantity") ?? 0),
  });
  revalidatePath("/dashboard/products");
}

export async function upsertHomepageAction(formData: FormData) {
  await upsertHomepage({
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    heroCtaLabel: String(formData.get("heroCtaLabel") ?? ""),
    heroCtaHref: String(formData.get("heroCtaHref") ?? ""),
    flashDealTitle: String(formData.get("flashDealTitle") ?? ""),
    flashDealEndsAt: String(formData.get("flashDealEndsAt") ?? ""),
    editorialTitle: String(formData.get("editorialTitle") ?? ""),
    editorialBody: String(formData.get("editorialBody") ?? ""),
    festiveBannerTitle: String(formData.get("festiveBannerTitle") ?? ""),
    festiveBannerBody: String(formData.get("festiveBannerBody") ?? ""),
    festiveBannerCtaLabel: String(formData.get("festiveBannerCtaLabel") ?? ""),
    festiveBannerCtaHref: String(formData.get("festiveBannerCtaHref") ?? ""),
  });
  revalidatePath("/dashboard/homepage");
}

export async function upsertSettingsAction(formData: FormData) {
  await upsertSettings({
    storeName: String(formData.get("storeName") ?? ""),
    supportEmail: String(formData.get("supportEmail") ?? ""),
    supportPhone: String(formData.get("supportPhone") ?? ""),
    footerTagline: String(formData.get("footerTagline") ?? ""),
    aboutPage: String(formData.get("aboutPage") ?? ""),
    contactPage: String(formData.get("contactPage") ?? ""),
    faqPage: String(formData.get("faqPage") ?? ""),
    termsPage: String(formData.get("termsPage") ?? ""),
    privacyPage: String(formData.get("privacyPage") ?? ""),
    refundPolicyPage: String(formData.get("refundPolicyPage") ?? ""),
  });
  revalidatePath("/dashboard/settings");
}

export async function createShippingMethodAction(formData: FormData) {
  await createShippingMethod({
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? ""),
    feeMinor: Number(formData.get("feeMinor") ?? 0),
    estimatedDelivery: String(formData.get("estimatedDelivery") ?? ""),
    codEnabled: formData.get("codEnabled") === "on",
    enabled: formData.get("enabled") === "on",
  });
  revalidatePath("/dashboard/orders");
}

export async function createCouponAction(formData: FormData) {
  await createCoupon({
    code: String(formData.get("code") ?? ""),
    type:
      (formData.get("type") as "percentage" | "fixed" | null) ?? "fixed",
    valueMinor: Number(formData.get("valueMinor") ?? 0),
    minimumSubtotalMinor: Number(formData.get("minimumSubtotalMinor") ?? 0),
    maxDiscountMinor: Number(formData.get("maxDiscountMinor") ?? 0),
    active: formData.get("active") === "on",
  });
  revalidatePath("/dashboard/coupons");
}

export async function updateOrderStatusAction(formData: FormData) {
  await updateOrderStatus(
    String(formData.get("orderId") ?? ""),
    String(formData.get("status") ?? "pending") as
      | "pending"
      | "confirmed"
      | "processing"
      | "packed"
      | "shipped"
      | "delivered"
      | "cancelled",
  );
  revalidatePath("/dashboard/orders");
}

export async function createAdminUserAction(formData: FormData) {
  await createAdminUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "support_manager") as
      | "super_admin"
      | "catalog_manager"
      | "order_manager"
      | "content_manager"
      | "support_manager",
  });
  revalidatePath("/dashboard/administrators");
}

export async function updateReviewStatusAction(formData: FormData) {
  await setReviewStatus(
    String(formData.get("reviewId") ?? ""),
    String(formData.get("status") ?? "approved") as "approved" | "rejected",
  );
  revalidatePath("/dashboard/reviews");
}

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get("file");
  const folderKind =
    (formData.get("folderKind") as
      | "products"
      | "categories"
      | "collections"
      | "home"
      | "branding"
      | null) ?? "products";
  const altText = String(formData.get("altText") ?? "");

  if (!(file instanceof File) || !file.size) {
    throw new Error("A file is required.");
  }

  const uploaded = await uploadImageToCloudinary(file, getCloudinaryFolder(folderKind));
  await connectToDatabase();
  const asset = await MediaAssetModel.create({
    publicId: uploaded.public_id,
    secureUrl: uploaded.secure_url,
    folder: getCloudinaryFolder(folderKind),
    altText,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    bytes: uploaded.bytes,
  });
  await recordAudit({
    action: "media.uploaded",
    entityType: "mediaAsset",
    entityId: String(asset._id),
    summary: asset.publicId,
  });
  revalidatePath("/dashboard/media");
}

export async function deleteMediaAction(formData: FormData) {
  const assetId = String(formData.get("assetId") ?? "");
  await connectToDatabase();
  const asset = await MediaAssetModel.findById(assetId);
  if (!asset) {
    throw new Error("Media asset not found.");
  }

  await deleteImageFromCloudinary(asset.publicId);
  await MediaAssetModel.findByIdAndDelete(assetId);
  await recordAudit({
    action: "media.deleted",
    entityType: "mediaAsset",
    entityId: assetId,
    summary: asset.publicId,
  });
  revalidatePath("/dashboard/media");
}
