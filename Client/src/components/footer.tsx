import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-[linear-gradient(180deg,#5a0c3d_0%,#3b0728_100%)]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Dazzling Diva</p>
            <p className="mt-4 text-sm text-white/75">
              Curated festive style, editorial silhouettes, and elevated everyday occasionwear.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/75">
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="space-y-3 text-sm text-white/75">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
          <div className="space-y-3 text-sm text-white/75">
            <Link href="/track-order">Track Order</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
