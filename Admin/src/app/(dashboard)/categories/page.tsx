import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/category";

import { createCategoryAction } from "../actions";

export default async function CategoriesPage() {
  await connectToDatabase();
  const categories = await CategoryModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form action={createCategoryAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create category</h1>
        <div className="mt-5 space-y-4">
          <input name="name" placeholder="Category name" required />
          <textarea name="description" placeholder="Description" rows={4} />
          <input name="imageUrl" placeholder="Cloudinary or CDN image URL" />
          <select name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">
            Save category
          </button>
        </div>
      </form>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Existing categories</h2>
        <div className="mt-5 space-y-3">
          {categories.map((category) => (
            <article
              key={String(category._id)}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-white/55">/{category.slug}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                  {category.status}
                </span>
              </div>
            </article>
          ))}
          {!categories.length && (
            <p className="text-sm text-white/65">
              No categories yet. Add your first storefront section anchor here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
