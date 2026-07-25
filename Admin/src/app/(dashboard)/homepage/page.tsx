import { connectToDatabase } from "@/lib/db";
import { HomePageConfigModel } from "@/models/homepage-config";

import { upsertHomepageAction } from "../actions";

export default async function HomepagePage() {
  await connectToDatabase();
  const homepage = await HomePageConfigModel.findOne().lean();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Homepage content</h1>
      <form action={upsertHomepageAction} className="mt-5 grid gap-4 md:grid-cols-2">
        <input name="heroTitle" placeholder="Hero title" defaultValue={homepage?.heroTitle ?? ""} />
        <input name="heroSubtitle" placeholder="Hero subtitle" defaultValue={homepage?.heroSubtitle ?? ""} />
        <input name="heroCtaLabel" placeholder="Hero CTA label" defaultValue={homepage?.heroCtaLabel ?? "Shop Now"} />
        <input name="heroCtaHref" placeholder="Hero CTA href" defaultValue={homepage?.heroCtaHref ?? "/shop"} />
        <input name="flashDealTitle" placeholder="Flash deal title" defaultValue={homepage?.flashDealTitle ?? ""} />
        <input
          name="flashDealEndsAt"
          type="datetime-local"
          defaultValue={
            homepage?.flashDealEndsAt
              ? new Date(homepage.flashDealEndsAt).toISOString().slice(0, 16)
              : ""
          }
        />
        <input name="editorialTitle" placeholder="Editorial title" defaultValue={homepage?.editorialTitle ?? ""} />
        <textarea
          name="editorialBody"
          placeholder="Editorial body"
          rows={4}
          defaultValue={homepage?.editorialBody ?? ""}
        />
        <input
          name="festiveBannerTitle"
          placeholder="Festive banner title"
          defaultValue={homepage?.festiveBannerTitle ?? ""}
        />
        <textarea
          name="festiveBannerBody"
          placeholder="Festive banner body"
          rows={4}
          defaultValue={homepage?.festiveBannerBody ?? ""}
        />
        <input
          name="festiveBannerCtaLabel"
          placeholder="Festive banner CTA label"
          defaultValue={homepage?.festiveBannerCtaLabel ?? "Shop Now"}
        />
        <input
          name="festiveBannerCtaHref"
          placeholder="Festive banner CTA href"
          defaultValue={homepage?.festiveBannerCtaHref ?? "/shop"}
        />
        <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3 md:col-span-2 md:w-fit">
          Save homepage
        </button>
      </form>
    </section>
  );
}
