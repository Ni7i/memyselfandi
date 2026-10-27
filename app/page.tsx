import ArtFilters from "@/components/art/ArtFilters";
import { AgeThree, Facts, FirstGame, GrowingUp, Hackathon, HowIWork, Life, OtherEnd, ProofSection, SchoolYears, Stations, StoryFooter, Work } from "@/components/story/Chapters";
import Overture from "@/components/story/Overture";
import IndexNav from "@/components/story/IndexNav";
import StoryMotion from "@/components/story/StoryMotion";
import "./story.css";
import { getPublishedProjects } from "@/lib/content/projects";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <>
      <a className="skip-link" href="#facts">Skip to the facts</a>
      <ArtFilters />
      <main className="story">
        {/* Der rote Faden: an illustrated autobiography in eleven scenes */}
        <Overture />
        <AgeThree />
        <GrowingUp />
        <SchoolYears />
        <Hackathon />
        <Stations />
        <FirstGame />
        <Work projects={projects} />
        <ProofSection />
        <Life />
        <HowIWork />
        <Facts />
        <OtherEnd />
      </main>
      <StoryFooter />
      <IndexNav />
      <StoryMotion />
    </>
  );
}
