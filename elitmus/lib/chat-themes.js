// Chat themes. Each one is just a set of colours; the chat reads them as inline styles.
//   bg      background of the message area (CSS `background`, so gradients and patterns work)
//   mine    my bubbles          mineText   text on my bubbles
//   theirs  their bubbles       theirsText / theirsBorder
//   muted   small text (times, hints)      bar   the typing bar at the bottom
const dots = (rgba) => `radial-gradient(circle at 1px 1px, ${rgba} 1px, transparent 0) 0 0 / 22px 22px`;

export const CHAT_THEMES = [
  {
    id: "blush",
    name: "Blush",
    bg: `${dots("rgba(224,83,61,0.10)")}, linear-gradient(180deg, #fff6ef 0%, #fdecef 100%)`,
    mine: "linear-gradient(135deg, #e0533d, #f08a5d)",
    mineText: "#ffffff",
    theirs: "#ffffff",
    theirsText: "#1d1a17",
    theirsBorder: "#f3dcd4",
    muted: "#a3877c",
    bar: "rgba(255,247,242,0.92)",
  },
  {
    id: "garden",
    name: "Garden",
    bg: `${dots("rgba(79,125,92,0.12)")}, linear-gradient(180deg, #f3f7f0 0%, #e6f0e8 100%)`,
    mine: "linear-gradient(135deg, #4f7d5c, #79a585)",
    mineText: "#ffffff",
    theirs: "#ffffff",
    theirsText: "#1d1a17",
    theirsBorder: "#d6e5d9",
    muted: "#7d9483",
    bar: "rgba(243,247,240,0.92)",
  },
  {
    id: "lagoon",
    name: "Lagoon",
    bg: `${dots("rgba(47,98,176,0.10)")}, linear-gradient(180deg, #f1f7fc 0%, #e2edf9 100%)`,
    mine: "linear-gradient(135deg, #2f62b0, #4c95d8)",
    mineText: "#ffffff",
    theirs: "#ffffff",
    theirsText: "#1d1a17",
    theirsBorder: "#d3e2f2",
    muted: "#7d8fa6",
    bar: "rgba(241,247,252,0.92)",
  },
  {
    id: "dusk",
    name: "Dusk",
    bg: `${dots("rgba(123,92,196,0.11)")}, linear-gradient(180deg, #f8f3fc 0%, #f0e5f6 100%)`,
    mine: "linear-gradient(135deg, #7b5cc4, #c27bd0)",
    mineText: "#ffffff",
    theirs: "#ffffff",
    theirsText: "#1d1a17",
    theirsBorder: "#e5d8ef",
    muted: "#9886a8",
    bar: "rgba(248,243,252,0.92)",
  },
  {
    id: "midnight",
    name: "Midnight",
    bg: `${dots("rgba(255,255,255,0.06)")}, linear-gradient(180deg, #161a24 0%, #1d1a2b 100%)`,
    mine: "linear-gradient(135deg, #e0533d, #f08a5d)",
    mineText: "#ffffff",
    theirs: "#262c3a",
    theirsText: "#eef0f5",
    theirsBorder: "#323a4b",
    muted: "#8a93a6",
    bar: "rgba(22,26,36,0.94)",
  },
  {
    id: "classic",
    name: "Classic",
    bg: "#faf7f2",
    mine: "#e0533d",
    mineText: "#ffffff",
    theirs: "#ffffff",
    theirsText: "#1d1a17",
    theirsBorder: "#e9e2d7",
    muted: "#968b80",
    bar: "rgba(250,247,242,0.9)",
  },
];

export const DEFAULT_THEME_ID = CHAT_THEMES[0].id;

// Unknown or missing ids fall back to the default
export function themeById(id) {
  return CHAT_THEMES.find((t) => t.id === id) ?? CHAT_THEMES[0];
}
