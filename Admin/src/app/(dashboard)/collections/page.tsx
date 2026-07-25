import { connectToDatabase } from "@/lib/db";
import { CollectionModel } from "@/models/collection";

import { createCollectionAction } from "../actions";

export default async function CollectionsPage() {
  await connectToDatabase();
  const collections = await CollectionModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form action={createCollectionAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create collection</h1>
        <div className="mt-5 space-y-4">
          <input name="name" placeholder="Collection name" required />
          <textarea name="description" placeholder="Description" rows={4} />
          <input name="coverImageUrl" placeholder="Collection cover image URL" />
          <select name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">
            Save collection
          </button>
        </div>
      </form>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Existing collections</h2>
        <div className="mt-5 space-y-3">
          {collections.map((collection) => (
            <article
              key={String(collection._id)}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <h3 className="font-medium">{collection.name}</h3>
              <p className="text-sm text-white/55">/{collection.slug}</p>
            </article>
          ))}
          {!collections.length && (
            <p className="text-sm text-white/65">
              No collections yet. Collections become the editorial story blocks on the storefront.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
