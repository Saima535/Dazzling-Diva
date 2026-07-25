import { getCsrfTokenForForm } from "@/lib/csrf";

export async function CsrfInput() {
  const token = await getCsrfTokenForForm();
  return <input type="hidden" name="_csrf" value={token} />;
}
