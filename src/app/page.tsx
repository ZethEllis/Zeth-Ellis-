import BrowseCareers from "@/components/BrowseCareers";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import { getCareers } from "@/lib/careers";

export default async function Home() {
  const careers = await getCareers();
  return (
    <>
      <Hero careerCount={careers.length} />
      <HowItWorks />
      <BrowseCareers careers={careers} />
    </>
  );
}
