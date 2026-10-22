import type { StaticImageData } from "next/image";
import daniellaGrad from "@/assets/story-daniella-grad.jpg";
import gregGrad from "@/assets/story-greg-grad.jpg";
import { engagementPhotos } from "@/content/engagement";

/**
 * Our Story page content. Text in [brackets] is placeholder until the couple
 * provides it. A null photo shows a "Photo coming soon" box.
 */

/** position is a CSS object-position, for photos whose subject is off center. */
export type Photo = { src: StaticImageData; alt: string; position?: string } | null;

export const couple = [
  {
    name: "Daniella",
    photo: null as Photo,
    bio: "[A few sentences about Daniella: who she is, what she does, what makes her smile.]",
    facts: [
      { label: "Hometown", value: "[Hometown]" },
      { label: "Job", value: "[Job]" },
      { label: "Favorite food", value: "[Favorite food]" },
      { label: "Hidden talent", value: "[Hidden talent]" },
    ],
  },
  {
    name: "Greg",
    photo: null as Photo,
    bio: "[A few sentences about Greg: who he is, what he does, what makes him smile.]",
    facts: [
      { label: "Hometown", value: "[Hometown]" },
      { label: "Job", value: "[Job]" },
      { label: "Favorite food", value: "[Favorite food]" },
      { label: "Hidden talent", value: "[Hidden talent]" },
    ],
  },
];

export const childhood = [
  {
    name: "Daniella",
    photo: null as Photo,
    place: "[Where Daniella grew up]",
    text: "[A favorite childhood memory, family, or what little Daniella was like.]",
  },
  {
    name: "Greg",
    photo: null as Photo,
    place: "[Where Greg grew up]",
    text: "[A favorite childhood memory, family, or what little Greg was like.]",
  },
];

export const education = [
  {
    name: "Daniella",
    photo: {
      src: daniellaGrad,
      alt: "Daniella in cap and gown, smiling and holding her diploma at her graduation ceremony",
    },
    school: "[School]",
    field: "[Field of study]",
    year: "[Year]",
  },
  {
    name: "Greg",
    photo: {
      src: gregGrad,
      alt: "Greg and three friends in green caps and gowns on a balcony at their graduation",
    },
    school: "[School]",
    field: "[Field of study]",
    year: "[Year]",
  },
];

export const howWeMet = {
  date: "[Date]",
  place: "[Place]",
  perspectives: [
    { name: "Daniella", text: "[How Daniella remembers the day they met.]" },
    { name: "Greg", text: "[How Greg remembers the day they met.]" },
  ],
};

export const timeline = [
  { date: "[Date]", title: "We met", text: "[A sentence about this moment.]" },
  { date: "[Date]", title: "First date", text: "[A sentence about this moment.]" },
  { date: "[Date]", title: "First trip together", text: "[A sentence about this moment.]" },
  { date: "[Date]", title: "Moved in together", text: "[A sentence about this moment.]" },
  { date: "[Date]", title: "The proposal", text: "[A sentence about this moment.]" },
  { date: "[Date]", title: "The wedding", text: "[A sentence about this moment.]" },
];

export const proposal = {
  photo: { ...engagementPhotos[3], position: "50% 28%" } as Photo,
  date: "[Date]",
  place: "[Place]",
  text: "[How the proposal happened: the plan, the surprise, the answer.]",
};

export const loveNotes = [
  { from: "Daniella", about: "Greg", text: "[What Daniella loves most about Greg.]" },
  { from: "Greg", about: "Daniella", text: "[What Greg loves most about Daniella.]" },
];

export const funQuestions = [
  { question: "Who said “I love you” first?", answer: "[Answer]" },
  { question: "Who is the better cook?", answer: "[Answer]" },
  { question: "Beach or mountains?", answer: "[Answer]" },
  { question: "Morning person or night owl?", answer: "[Answer]" },
  { question: "Who takes longer to get ready?", answer: "[Answer]" },
];
