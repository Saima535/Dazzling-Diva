import { env } from "@/src/lib/env";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: string;
  };

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload.data;
}

export type PublicCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export type PublicProduct = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  material: string;
  careInstructions: string;
  heroImageUrl: string;
  status: string;
  featured: boolean;
  newArrival: boolean;
  mostLoved: boolean;
  gallery: { url: string; alt: string }[];
  variants: {
    _id: string;
    sku: string;
    size: string;
    color: string;
    priceMinor: number;
    compareAtPriceMinor: number;
    stockQuantity: number;
  }[];
};

export async function getHomeData() {
  return apiFetch<{
    homepage: {
      heroTitle?: string;
      heroSubtitle?: string;
      heroCtaLabel?: string;
      heroCtaHref?: string;
      flashDealTitle?: string;
      editorialTitle?: string;
      editorialBody?: string;
      festiveBannerTitle?: string;
      festiveBannerBody?: string;
      festiveBannerCtaLabel?: string;
      festiveBannerCtaHref?: string;
    } | null;
    settings: {
      storeName?: string;
      footerTagline?: string;
    } | null;
    categories: PublicCategory[];
    featured: PublicProduct[];
    newArrivals: PublicProduct[];
    mostLoved: PublicProduct[];
    serverTime: string;
  }>("/content/home");
}

export async function getProducts() {
  return apiFetch<PublicProduct[]>("/catalog/products");
}

export async function getProduct(slug: string) {
  return apiFetch<PublicProduct>(`/catalog/products/${slug}`);
}

export async function getCategory(slug: string) {
  return apiFetch<{ category: PublicCategory; products: PublicProduct[] }>(
    `/catalog/categories/${slug}`,
  );
}

export async function getCollection(slug: string) {
  return apiFetch<{
    collection: {
      _id: string;
      name: string;
      slug: string;
      description: string;
      coverImageUrl: string;
    };
    products: PublicProduct[];
  }>(`/catalog/collections/${slug}`);
}

export async function getPages() {
  return apiFetch<{
    storeName?: string;
    supportEmail?: string;
    supportPhone?: string;
    aboutPage?: string;
    contactPage?: string;
    faqPage?: string;
    termsPage?: string;
    privacyPage?: string;
    refundPolicyPage?: string;
    footerTagline?: string;
  }>("/content/pages");
}

export async function createOrder(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  district: string;
  shippingMethodCode: string;
  items: { productSlug: string; sku: string; quantity: number }[];
}) {
  return apiFetch<{ orderNumber: string }>("/checkout/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function trackOrder(orderNumber: string) {
  return apiFetch<{
    orderNumber: string;
    customerName: string;
    orderStatus: string;
    paymentStatus: string;
    grandTotalMinor: number;
  }>(`/orders/track/${orderNumber}`);
}
