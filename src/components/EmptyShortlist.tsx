import Link from "next/link";

export default function EmptyShortlist() {
  return (
    <p className="mt-4 text-slate-600">
      Nothing saved yet. <Link href="/quiz" className="text-brand-600 hover:underline">Take the quiz</Link> and star the careers you like.
    </p>
  );
}
