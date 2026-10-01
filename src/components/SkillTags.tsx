export default function SkillTags({ skills }: { skills: string[] }) {
  return (
    <>
      <h2 className="mt-8 text-xl font-semibold">Skills that help</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.map((s) => (
          <li key={s} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{s}</li>
        ))}
      </ul>
    </>
  );
}
