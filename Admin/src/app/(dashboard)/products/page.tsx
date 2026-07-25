import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/category";
import { CollectionModel } from "@/models/collection";
import { ProductModel } from "@/models/product";

import { createProductAction } from "../actions";

type DashboardProduct = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  variants: { sku?: string; stockQuantity?: number }[];
};

export default async function ProductsPage() {
  await connectToDatabase();
  const [products, categories, collections] = await Promise.all([
    ProductModel.find().sort({ createdAt: -1 }).lean(),
    CategoryModel.find().sort({ name: 1 }).lean(),
    CollectionModel.find().sort({ name: 1 }).lean(),
  ]);
  const catalog = products as unknown as DashboardProduct[];

  return (
    <section className="space-y-8">
      <form action={createProductAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create product</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Product name" required />
          <input name="heroImageUrl" placeholder="Primary image URL" />
          <textarea className="md:col-span-2" name="shortDescription" placeholder="Short description" rows={2} />
          <textarea className="md:col-span-2" name="description" placeholder="Full description" rows={5} />
          <input name="material" placeholder="Material" />
          <input name="careInstructions" placeholder="Care instructions" />
          <select name="categoryId" defaultValue="">
            <option value="">No category yet</option>
            {categories.map((category) => (
              <option key={String(category._id)} value={String(category._id)}>
                {category.name}
              </option>
            ))}
          </select>
          <select multiple className="min-h-32" name="collectionIds">
            {collections.map((collection) => (
              <option key={String(collection._id)} value={String(collection._id)}>
                {collection.name}
              </option>
            ))}
          </select>
          <input name="variantSku" placeholder="SKU" required />
          <input name="variantSize" placeholder="Size" defaultValue="Free Size" />
          <input name="variantColor" placeholder="Color" defaultValue="Default" />
          <input name="variantPriceMinor" placeholder="Price in minor units (e.g. 125000)" required />
          <input name="variantCompareAtPriceMinor" placeholder="Compare at price in minor units" defaultValue="0" />
          <input name="variantStockQuantity" placeholder="Stock quantity" required />
          <select name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <div className="flex items-center gap-6 text-sm text-white/75">
            <label><input className="mr-2 w-auto" type="checkbox" name="featured" />Featured</label>
            <label><input className="mr-2 w-auto" type="checkbox" name="newArrival" />New arrival</label>
            <label><input className="mr-2 w-auto" type="checkbox" name="mostLoved" />Most loved</label>
          </div>
        </div>
        <button className="mt-5 rounded-full bg-[var(--brand-strong)] px-5 py-3">
          Save product
        </button>
      </form>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Catalog</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {catalog.map((product) => (
            <article
              key={String(product._id)}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-white/55">/{product.slug}</p>
                  <p className="mt-2 text-sm text-white/70">
                    {product.variants[0]?.sku ?? "No SKU"} ·{" "}
                    {product.variants[0]?.stockQuantity ?? 0} in stock
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                  {product.status}
                </span>
              </div>
            </article>
          ))}
          {!products.length && (
            <p className="text-sm text-white/65">
              No products yet. Published products will appear on the storefront automatically.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
