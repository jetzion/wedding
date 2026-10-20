import type { StaticImageData } from "next/image";
import e01 from "@/assets/engagement/engagement-01.jpg";
import e02 from "@/assets/engagement/engagement-02.jpg";
import e03 from "@/assets/engagement/engagement-03.jpg";
import e04 from "@/assets/engagement/engagement-04.jpg";
import e05 from "@/assets/engagement/engagement-05.jpg";
import e06 from "@/assets/engagement/engagement-06.jpg";
import e07 from "@/assets/engagement/engagement-07.jpg";
import e08 from "@/assets/engagement/engagement-08.jpg";
import e09 from "@/assets/engagement/engagement-09.jpg";
import e10 from "@/assets/engagement/engagement-10.jpg";
import e11 from "@/assets/engagement/engagement-11.jpg";
import e12 from "@/assets/engagement/engagement-12.jpg";
import e13 from "@/assets/engagement/engagement-13.jpg";
import e14 from "@/assets/engagement/engagement-14.jpg";
import e15 from "@/assets/engagement/engagement-15.jpg";
import e16 from "@/assets/engagement/engagement-16.jpg";
import e17 from "@/assets/engagement/engagement-17.jpg";
import e18 from "@/assets/engagement/engagement-18.jpg";
import e19 from "@/assets/engagement/engagement-19.jpg";

export type GalleryPhoto = { src: StaticImageData; alt: string };

/** Engagement photos in story order: proposal, ring, portraits, family. */
export const engagementPhotos: GalleryPhoto[] = [
  { src: e01, alt: "Greg on one knee in a garden courtyard as Daniella looks down at him" },
  { src: e02, alt: "Daniella covers her mouth in surprise as Greg kneels with the ring" },
  { src: e03, alt: "Daniella smiles down at Greg as he proposes among tropical plants" },
  { src: e04, alt: "Greg and Daniella share a moment beside a garden bench" },
  { src: e05, alt: "Greg and Daniella embrace after the proposal" },
  { src: e06, alt: "Black-and-white photo of Greg and Daniella hugging" },
  { src: e07, alt: "Close-up of Daniella's hand wearing her engagement ring, resting on Greg's hand" },
  { src: e08, alt: "Greg and Daniella smiling in a hallway with a checkered floor" },
  { src: e09, alt: "Greg and Daniella posing together in a long checkered-floor corridor" },
  { src: e10, alt: "Daniella leans into Greg in the checkered-floor corridor" },
  { src: e11, alt: "Greg and Daniella holding hands and smiling in the corridor" },
  { src: e12, alt: "Greg and Daniella holding hands in front of a fountain" },
  { src: e13, alt: "Greg kisses Daniella beside a fountain" },
  { src: e14, alt: "Greg throws his arm out in celebration as Daniella laughs" },
  { src: e15, alt: "Greg hugging a family member" },
  { src: e16, alt: "Greg embracing an older family member" },
  { src: e17, alt: "Two family members sharing a hug" },
  { src: e18, alt: "Daniella hugging a family member, both smiling" },
  { src: e19, alt: "Greg and Daniella with their families in the garden" },
];
