const formatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
});

export function formatMoney(minor: number) {
  return formatter.format(minor / 100);
}
