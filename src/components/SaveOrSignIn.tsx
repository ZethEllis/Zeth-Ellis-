import Link from "next/link";
import SaveButton from "./SaveButton";

export default function SaveOrSignIn({ slug, saved, canSave }: { slug: string; saved: boolean; canSave: boolean }) {
  return canSave ? (
    <SaveButton slug={slug} saved={saved} />
  ) : (
    <Link href="/login" className="text-brand-600 hover:underline">Sign in to save</Link>
  );
}
