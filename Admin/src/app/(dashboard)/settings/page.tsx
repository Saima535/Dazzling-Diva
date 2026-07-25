import { connectToDatabase } from "@/lib/db";
import { SiteSettingsModel } from "@/models/site-settings";

import { upsertSettingsAction } from "../actions";

export default async function SettingsPage() {
  await connectToDatabase();
  const settings = await SiteSettingsModel.findOne().lean();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Store settings</h1>
      <form action={upsertSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
        <input name="storeName" placeholder="Store name" defaultValue={settings?.storeName ?? "Dazzling Diva"} />
        <input name="supportEmail" placeholder="Support email" defaultValue={settings?.supportEmail ?? ""} />
        <input name="supportPhone" placeholder="Support phone" defaultValue={settings?.supportPhone ?? ""} />
        <input name="footerTagline" placeholder="Footer tagline" defaultValue={settings?.footerTagline ?? ""} />
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
    </section>
  );
}
