import Link from "next/link";

import { ProductCard } from "@/src/components/product-card";
import { SectionHeading } from "@/src/components/section-heading";
import { getHomeData } from "@/src/lib/api";

export default async function HomePage() {
  const data = await getHomeData().catch(() => null);

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#2f1a12_0%,#100c0d_50%,#3f182f_100%)] p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.45em] text-white/55">Luxury festive wardrobe</p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
            {data?.homepage?.heroTitle || "Super Saving Fest arrivals for modern celebrations"}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            {data?.homepage?.heroSubtitle ||
              "Build the public storefront from live published catalog records and keep the editorial mood polished even while the collection is still growing."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={data?.homepage?.heroCtaHref || "/shop"}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
            >
              {data?.homepage?.heroCtaLabel || "Shop now"}
            </Link>
            <Link
              href="/track-order"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium"
            >
              Track your order
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          {(data?.categories || []).slice(0, 4).map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/45">Category</p>
              <h2 className="mt-3 text-2xl font-semibold">{category.name}</h2>
              <p className="mt-2 text-sm text-white/65">
                {category.description || "Explore the latest edit curated in this story."}
              </p>
            </Link>
          ))}
          {!data?.categories?.length && (
            <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/4 p-6 text-sm text-white/65">
              Publish categories from the Admin app to populate the storefront editorial cards.
            </div>
          )}
        </div>
      </section>

      <section className="bg-[linear-gradient(90deg,#5a0c3d_0%,#830554_50%,#2a1222_100%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <SectionHeading
            eyebrow="Flash deals"
            title={data?.homepage?.flashDealTitle || "Flash deals go live when the admin configures them"}
            copy="The backend returns server-authoritative time so expired promotions can be retired cleanly."
          />
          <p className="text-sm text-white/75">Server time: {data?.serverTime ?? "Unavailable"}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Featured"
          title="Curated spotlight"
          copy="Featured published products appear here automatically once merchandised from the admin dashboard."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(data?.featured || []).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
          {!data?.featured?.length && (
            <div className="rounded-[1.5rem] border border-dashed border-white/12 p-6 text-sm text-white/60">
              No featured products are published yet.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(180deg,#321523_0%,#120c0f_100%)] p-8">
          <SectionHeading
            eyebrow="Editorial"
            title={data?.homepage?.editorialTitle || "Timeless elegance, modern comfort"}
            copy={data?.homepage?.editorialBody || "Luxury storytelling panels stay balanced even before every section is fully configured."}
          />
          <Link href="/shop" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
            Discover now
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {(data?.newArrivals || []).slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHeading
          eyebrow="New arrivals"
          title="Latest from the publish queue"
          copy="The storefront never uses fake products. If the catalog is empty, the layout still holds its shape."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(data?.newArrivals || []).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <div className="rounded-[2rem] bg-[linear-gradient(90deg,#4d0d35_0%,#2a0f23_50%,#5d0a36_100%)] px-8 py-12">
          <SectionHeading
            eyebrow="Festive callout"
            title={data?.homepage?.festiveBannerTitle || "Discover festive wardrobe now on sale"}
            copy={data?.homepage?.festiveBannerBody || "Use the Admin homepage screen to refine this message, then publish products to complete the composition."}
          />
          <Link
            href={data?.homepage?.festiveBannerCtaHref || "/shop"}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
          >
            {data?.homepage?.festiveBannerCtaLabel || "Shop now"}
          </Link>
        </div>
      </section>
    </main>
  );
}
