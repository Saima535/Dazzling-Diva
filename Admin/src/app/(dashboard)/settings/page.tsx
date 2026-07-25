import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import { ShippingMethodModel } from "@/models/shipping-method";
import { SiteSettingsModel } from "@/models/site-settings";

import { upsertSettingsAction } from "../actions";

export default async function SettingsPage() {
  await connectToDatabase();
  const [settings, publishedProducts, publishedCategories, activeShippingMethods] = await Promise.all([
    SiteSettingsModel.findOne().lean(),
    ProductModel.countDocuments({ status: "published" }),
    CategoryModel.countDocuments({ status: "published" }),
    ShippingMethodModel.countDocuments({ enabled: true }),
  ]);
  const readiness = [
    ["Support email", Boolean(settings?.supportEmail)],
    ["Support phone", Boolean(settings?.supportPhone)],
    ["About page", Boolean(settings?.aboutPage)],
    ["Contact page", Boolean(settings?.contactPage)],
    ["FAQ page", Boolean(settings?.faqPage)],
    ["Terms page", Boolean(settings?.termsPage)],
    ["Privacy page", Boolean(settings?.privacyPage)],
    ["Refund policy", Boolean(settings?.refundPolicyPage)],
    ["Logo URL", Boolean(settings?.logoUrl)],
    ["Favicon URL", Boolean(settings?.faviconUrl)],
    ["Published categories", publishedCategories > 0],
    ["Published products", publishedProducts > 0],
    ["Active shipping methods", activeShippingMethods > 0],
  ];

  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Store settings</h1>
        <form action={upsertSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="storeName" placeholder="Store name" defaultValue={settings?.storeName ?? "Dazzling Diva"} />
          <input name="supportEmail" placeholder="Support email" defaultValue={settings?.supportEmail ?? ""} />
          <input name="supportPhone" placeholder="Support phone" defaultValue={settings?.supportPhone ?? ""} />
          <input name="footerTagline" placeholder="Footer tagline" defaultValue={settings?.footerTagline ?? ""} />
          <input name="logoUrl" placeholder="Logo URL" defaultValue={settings?.logoUrl ?? ""} />
          <input name="faviconUrl" placeholder="Favicon URL" defaultValue={settings?.faviconUrl ?? ""} />
          <textarea className="md:col-span-2" name="aboutPage" placeholder="About page" rows={5} defaultValue={settings?.aboutPage ?? ""} />
          <textarea className="md:col-span-2" name="contactPage" placeholder="Contact page" rows={5} defaultValue={settings?.contactPage ?? ""} />
          <textarea className="md:col-span-2" name="faqPage" placeholder="FAQ page" rows={5} defaultValue={settings?.faqPage ?? ""} />
          <textarea className="md:col-span-2" name="termsPage" placeholder="Terms page" rows={5} defaultValue={settings?.termsPage ?? ""} />
          <textarea className="md:col-span-2" name="privacyPage" placeholder="Privacy page" rows={5} defaultValue={settings?.privacyPage ?? ""} />
          <textarea
            className="md:col-span-2"
            name="refundPolicyPage"
            placeholder="Refund policy page"
            rows={5}
            defaultValue={settings?.refundPolicyPage ?? ""}
          />
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3 md:w-fit">
            Save settings
          </button>
        </form>
      </div>
      <aside className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Readiness checklist</h2>
        <div className="mt-5 space-y-3">
          {readiness.map(([label, done]) => (
            <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-sm">{label}</span>
              <span className="text-xs uppercase tracking-[0.25em] text-white/55">
                {done ? "ready" : "missing"}
              </span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
