export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.4em] text-white/45">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{title}</h2>
      {copy ? <p className="mt-4 text-sm leading-7 text-white/70">{copy}</p> : null}
    </div>
  );
}
