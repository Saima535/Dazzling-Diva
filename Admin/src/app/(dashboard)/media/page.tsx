import { getCloudinaryConfigState, getCloudinaryFolder } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { requireAdminRole } from "@/lib/rbac";
import { MediaAssetModel } from "@/models/media-asset";

import { deleteMediaAction, uploadMediaAction } from "../actions";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; folder?: string }>;
}) {
  await requireAdminRole(["super_admin", "catalog_manager", "content_manager"]);
  const params = await searchParams;
  await connectToDatabase();
  const config = await getCloudinaryConfigState();
  const query: Record<string, unknown> = {};
  if (params.q) {
    query.$or = [
      { publicId: { $regex: params.q, $options: "i" } },
      { altText: { $regex: params.q, $options: "i" } },
    ];
  }
  if (params.folder) {
    query.folder = params.folder;
  }
  const assets = await MediaAssetModel.find(query).sort({ createdAt: -1 }).limit(30).lean();

  return (
    <section className="space-y-6">
      <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Media and Cloudinary</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/55">Configured</p>
            <p className="mt-2 font-medium">{config.configured ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/55">Products folder</p>
            <p className="mt-2 font-medium">{getCloudinaryFolder("products")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/55">Collections folder</p>
            <p className="mt-2 font-medium">{getCloudinaryFolder("collections")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-white/55">Branding folder</p>
            <p className="mt-2 font-medium">{getCloudinaryFolder("branding")}</p>
          </div>
        </div>
      </article>
      <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Tracked media assets</h2>
        <form className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <input name="q" placeholder="Search public id or alt text" defaultValue={params.q ?? ""} />
          <input name="folder" placeholder="Filter by folder" defaultValue={params.folder ?? ""} />
          <button className="rounded-full border border-white/10 px-5 py-3 text-sm">Filter</button>
        </form>
        <form action={uploadMediaAction} className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_1fr_auto]">
          <input name="file" type="file" accept="image/*" required />
          <select name="folderKind" defaultValue="products">
            <option value="products">products</option>
            <option value="categories">categories</option>
            <option value="collections">collections</option>
            <option value="home">home</option>
            <option value="branding">branding</option>
          </select>
          <input name="altText" placeholder="Alt text" />
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">Upload</button>
        </form>
        <div className="mt-5 space-y-3">
          {assets.map((asset) => (
            <div key={String(asset._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="font-medium">{asset.publicId}</p>
              <p className="mt-1 text-sm text-white/55">{asset.secureUrl}</p>
              <p className="mt-1 text-xs text-white/45">
                {asset.folder} · alt: {asset.altText || "none"} · usages: {asset.usageReferences?.join(", ") || "none"}
              </p>
              <form action={uploadMediaAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="replaceAssetId" value={String(asset._id)} />
                <input name="file" type="file" accept="image/*" required />
                <input name="altText" placeholder="Updated alt text" defaultValue={asset.altText ?? ""} />
                <button className="rounded-full border border-white/10 px-3 py-2 text-xs">
                  Replace
                </button>
              </form>
              <form action={deleteMediaAction} className="mt-3">
                <input type="hidden" name="assetId" value={String(asset._id)} />
                <button className="rounded-full border border-white/10 px-3 py-2 text-xs">
                  Delete
                </button>
              </form>
            </div>
          ))}
          {!assets.length ? (
            <p className="text-sm text-white/65">
              Media tracking is ready, but no assets have been recorded yet.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  );
}
