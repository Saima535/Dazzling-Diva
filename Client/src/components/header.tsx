import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
          Dazzling Diva
        </Link>
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <Link href="/shop">Shop</Link>
          <Link href="/track-order">Track Order</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart">Cart</Link>
          <Link href="/account/login">Account</Link>
        </div>
      </div>
    </header>
  );
}
