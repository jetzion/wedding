import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import {
  EngagementPhotos,
  FunQuestions,
  HowWeMet,
  Proposal,
  Timeline,
} from "@/components/story/journey-sections";
import {
  EarlyChildhood,
  Education,
  LoveNotes,
  MeetTheCouple,
} from "@/components/story/people-sections";
import image from "@/assets/page-story.jpg";

export const metadata: Metadata = { title: "Our Story" };

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title="Our Story" image={image} />
      <MeetTheCouple />
      <EarlyChildhood />
      <Education />
      <HowWeMet />
      <Timeline />
      <Proposal />
      <EngagementPhotos />
      <LoveNotes />
      <FunQuestions />
    </main>
  );
}
