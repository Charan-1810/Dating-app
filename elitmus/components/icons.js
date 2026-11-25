// A small icon set (line icons, 24×24, drawn with the current text colour).
// Inline SVG instead of an icon library: no extra dependency, and the icons
// inherit colour and size from Tailwind classes, e.g. <HeartIcon className="size-4 text-accent" />.

function icon(name, paths) {
  function Icon({ className = "size-5", ...props }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const CompassIcon = icon("CompassIcon", <>
  <circle cx="12" cy="12" r="10" />
  <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
</>);

export const HeartIcon = icon("HeartIcon",
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
);

export const UserIcon = icon("UserIcon", <>
  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
  <circle cx="12" cy="7" r="4" />
</>);

export const SlidersIcon = icon("SlidersIcon", <>
  <path d="M20 7h-9M14 17H5" />
  <circle cx="17" cy="17" r="3" />
  <circle cx="7" cy="7" r="3" />
</>);

export const LogOutIcon = icon("LogOutIcon", <>
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <path d="m16 17 5-5-5-5M21 12H9" />
</>);

export const SearchIcon = icon("SearchIcon", <>
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.3-4.3" />
</>);

export const MapPinIcon = icon("MapPinIcon", <>
  <path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" />
  <circle cx="12" cy="10" r="3" />
</>);

export const TargetIcon = icon("TargetIcon", <>
  <circle cx="12" cy="12" r="10" />
  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2" />
</>);

export const ChevronLeftIcon = icon("ChevronLeftIcon", <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = icon("ChevronRightIcon", <path d="m9 18 6-6-6-6" />);
export const ArrowRightIcon = icon("ArrowRightIcon", <path d="M5 12h14m-7-7 7 7-7 7" />);
export const CheckIcon = icon("CheckIcon", <path d="M20 6 9 17l-5-5" />);
export const XIcon = icon("XIcon", <path d="M18 6 6 18M6 6l12 12" />);
export const PlusIcon = icon("PlusIcon", <path d="M5 12h14M12 5v14" />);

export const SendIcon = icon("SendIcon", <>
  <path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z" />
  <path d="m21.85 2.15-10.94 10.94" />
</>);

export const SparklesIcon = icon("SparklesIcon",
  <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" />
);

export const CameraIcon = icon("CameraIcon", <>
  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
  <circle cx="12" cy="13" r="3" />
</>);

export const MessageIcon = icon("MessageIcon", <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />);

export const ShieldIcon = icon("ShieldIcon",
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
);

export const FlagIcon = icon("FlagIcon", <>
  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
  <path d="M4 22v-7" />
</>);

export const BanIcon = icon("BanIcon", <>
  <circle cx="12" cy="12" r="10" />
  <path d="m4.9 4.9 14.2 14.2" />
</>);

export const PencilIcon = icon("PencilIcon",
  <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
);

export const TrashIcon = icon("TrashIcon",
  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
);

export const FileIcon = icon("FileIcon", <>
  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
</>);

export const QuoteIcon = icon("QuoteIcon", <>
  <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
</>);

// Verified badge: filled blue rosette with a white tick
export function VerifiedIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="var(--color-sky)"
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      />
      <path d="m9 12 2 2 4-4" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PaletteIcon = icon("PaletteIcon", <>
  <circle cx="13.5" cy="6.5" r="1" fill="currentColor" />
  <circle cx="17.5" cy="10.5" r="1" fill="currentColor" />
  <circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
  <circle cx="6.5" cy="12.5" r="1" fill="currentColor" />
  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z" />
</>);
