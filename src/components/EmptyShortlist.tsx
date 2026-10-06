import Link from "next/link";

export default function EmptyShortlist() {
  return (
    <p className="mt-4 text-slate-600">
      Nothing saved yet. <Link href="/sandbox" className="text-brand-600 hover:underline">Open the sandbox</Link> and star the careers you like.
    </p>
  );
}
