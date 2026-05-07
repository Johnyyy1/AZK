import type { SVGProps } from "react";

export type IconName =
  | "arrow_forward"
  | "calendar_today"
  | "close"
  | "dashboard"
  | "east"
  | "leaderboard"
  | "menu"
  | "north_east"
  | "potted_plant"
  | "settings"
  | "tune"
  | "water_drop"
  | "water_lock"
  | "west";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

function IconPath({ name }: { name: IconName }) {
  switch (name) {
    case "arrow_forward":
      return <path d="M5 12h14m-5-5 5 5-5 5" />;
    case "calendar_today":
      return (
        <>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
        </>
      );
    case "close":
      return <path d="m6 6 12 12M18 6 6 18" />;
    case "dashboard":
      return (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="11" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="17" width="7" height="3" rx="1.5" />
        </>
      );
    case "east":
      return <path d="M5 12h14m-4.5-4.5L19 12l-4.5 4.5" />;
    case "leaderboard":
      return (
        <>
          <path d="M4.5 19.5h15" />
          <rect x="5" y="11" width="3.5" height="6.5" rx="1" />
          <rect x="10.25" y="7" width="3.5" height="10.5" rx="1" />
          <rect x="15.5" y="4.5" width="3.5" height="13" rx="1" />
        </>
      );
    case "menu":
      return <path d="M4 7.5h16M4 12h16M4 16.5h16" />;
    case "north_east":
      return <path d="M7 17 17 7M9 7h8v8" />;
    case "potted_plant":
      return (
        <>
          <path d="M12 13V7.5" />
          <path d="M12 10c0-3 2.2-4.8 5-5-.2 2.7-1.7 5-5 5Zm0 0c0-2.9-2.2-4.7-5-5 .2 2.7 1.8 5 5 5Z" />
          <path d="M7 13h10l-1.4 6H8.4L7 13Z" />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 3.75v2.5M12 17.75v2.5M20.25 12h-2.5M6.25 12h-2.5M17.83 6.17l-1.77 1.77M7.94 16.06l-1.77 1.77M17.83 17.83l-1.77-1.77M7.94 7.94 6.17 6.17" />
        </>
      );
    case "tune":
      return (
        <>
          <path d="M5 6.5h5m4 0h5M10 4v5M5 17.5h9m4 0h1M14 15v5" />
        </>
      );
    case "water_drop":
      return <path d="M12 3.75c2.9 3.7 5.25 6.6 5.25 9.56A5.25 5.25 0 1 1 6.75 13.3C6.75 10.35 9.1 7.44 12 3.75Z" />;
    case "water_lock":
      return (
        <>
          <path d="M12 3.5c2.6 3.35 4.75 5.98 4.75 8.65a4.75 4.75 0 0 1-9.5 0c0-2.67 2.15-5.3 4.75-8.65Z" />
          <rect x="9" y="12.75" width="6" height="4.75" rx="1" />
          <path d="M10.5 12.75v-1a1.5 1.5 0 1 1 3 0v1" />
        </>
      );
    case "west":
      return <path d="M19 12H5m4.5-4.5L5 12l4.5 4.5" />;
    default:
      return null;
  }
}

export default function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`inline-block h-[1em] w-[1em] shrink-0 align-middle ${className ?? ""}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <IconPath name={name} />
    </svg>
  );
}
