export interface GuideEntry {
  file: string;
  label: string;
}

export interface GuideGroup {
  slug: string;
  title: string;
  pageNumber: string;
  guides: GuideEntry[];
}

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    slug: "alex",
    title: "ALEX GUIDES",
    pageNumber: "G01",
    guides: [
      { file: "alex", label: "GAME PLAN" },
      { file: "alex-vs", label: "REMATCH GUIDE" },
      { file: "alex-turn-guide", label: "TURN GUIDE" },
      { file: "alex-items-abilities", label: "ITEMS & ABILITIES" },
      { file: "alex-noob-guide", label: "NOOB GUIDE" },
    ],
  },
  {
    slug: "conor",
    title: "CONOR GUIDES",
    pageNumber: "G02",
    guides: [
      { file: "conor", label: "GAME PLAN" },
      { file: "conor-counter-plan", label: "COUNTER-PLAN" },
      { file: "conor-turn-plan", label: "TURN PLAN" },
      {
        file: "conor-chandelure-addendum",
        label: "TERA FIGHTING CHANDELURE ADDENDUM",
      },
      { file: "conor-final-tips", label: "FINAL TIPS" },
      { file: "conor-noob-guide", label: "NOOB-FRIENDLY GUIDE" },
    ],
  },
  {
    slug: "jack",
    title: "JACK GUIDE",
    pageNumber: "G03",
    guides: [{ file: "jack", label: "MICHAEL VS JACK" }],
  },
  {
    slug: "mark",
    title: "MARK GUIDES",
    pageNumber: "G04",
    guides: [
      { file: "mark-v2", label: "GAME PLAN (V2)" },
      { file: "mark-turn-guide", label: "TURN GUIDE" },
      { file: "mark-items-abilities", label: "ITEMS & ABILITIES" },
      { file: "mark-noob-guide", label: "NOOB-FRIENDLY GUIDE" },
    ],
  },
];
