import ArtFilters from "@/components/art/ArtFilters";
import { AgeThree, Facts, GrowingUp, Hackathon, HowIWork, OtherEnd, ProofSection, SchoolYears, Stations, StoryFooter, Work } from "@/components/story/Chapters";
import Overture from "@/components/story/Overture";
import IndexNav from "@/components/story/IndexNav";
import StoryMotion from "@/components/story/StoryMotion";
import MobilePortfolio from "@/components/MobilePortfolio";
import ResponsiveHome from "@/components/ResponsiveHome";
import { headers } from "next/headers";
import "./story.css";
import { getPublishedProjects } from "@/lib/content/projects";

// Projects are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublishedProjects();
  const userAgent = (await headers()).get("user-agent") ?? "";
  // Give phones the classic portfolio on the first response; matchMedia then
  // follows the actual viewport, including browser resizing and rotation.
  const initialMobile = /Mobi|iPhone|iPod|Windows Phone/i.test(userAgent);

  return (
    <ResponsiveHome
      initialMobile={initialMobile}
      mobile={<MobilePortfolio projects={projects} />}
      desktop={
        <>
          <a className="skip-link" href="#facts">Skip to the facts</a>
          <ArtFilters />
          <main className="story">
            {/* Der rote Faden: an illustrated autobiography in ten scenes */}
            <Overture />
            <AgeThree />
            <GrowingUp />
            <SchoolYears />
            <Hackathon />
            <Stations />
            <Work projects={projects} />
            <ProofSection />
            <HowIWork />
            <Facts />
            <OtherEnd />
          </main>
          <StoryFooter />
          <IndexNav />
          <StoryMotion />
        </>
      }
    />
  );
}
