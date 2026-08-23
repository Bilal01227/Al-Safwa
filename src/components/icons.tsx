/** Hand-drawn inline SVG icon set — industrial stroke style, 24×24. */
import type { SVGProps } from "react";
import type { IconKey } from "../lib/types";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 20,
  height: 20,
  "aria-hidden": true,
  ...props,
});

export const IcDrill = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 8.5h11v6H7l-4.5-2v-4Z" />
    <path d="M13.5 9.5h4l3 1v2l-3 1h-4" />
    <path d="M8 14.5v3.5h4.5v-3.5" />
    <path d="M20.5 10.7v2.6" />
    <path d="M5.5 8.5v6" />
  </svg>
);

export const IcCrane = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 11 9 5h4l1.5 6" />
    <path d="M4 11h12l1.5 6H3L4 11Z" />
    <path d="M17.5 11l3 2.5V17" />
    <rect x="4.5" y="17" width="12" height="3" rx="1.5" />
    <path d="M8 17v3M13 17v3" />
  </svg>
);

export const IcHelmet = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 14a7 7 0 0 1 14 0" />
    <path d="M3.5 14h17v2.5h-17z" />
    <path d="M12 5.5V10M8.5 6.2v3M15.5 6.2v3" />
  </svg>
);

export const IcWrench = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const IcMotor = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="6.2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5M6.2 6.2 7.9 7.9M16.1 16.1l1.7 1.7M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7" />
  </svg>
);

export const IcGear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" />
  </svg>
);

export const IcHook = (p: P) => (
  <svg {...base(p)}>
    <rect x="9.5" y="2.5" width="5" height="3.5" />
    <path d="M12 6v6" />
    <path d="M12 12a4.2 4.2 0 1 0 4.2 4.2" />
    <path d="M16.2 13.5v2.7h-2.7" />
  </svg>
);

export const IcBolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 2.5 5 13.5h5.5L11 21.5l8-11h-5.5L13 2.5Z" />
  </svg>
);

export const IcWhatsApp = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" />
    <path d="M9 8.4c.4 2.6 4 6.2 6.6 6.6l1-1.2-2.1-1.3-.9.6c-.9-.4-1.9-1.4-2.3-2.3l.6-.9L10.6 8 9 8.4Z" fill="currentColor" strokeWidth="0.5" />
  </svg>
);

export const IcPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const IcMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
);

export const IcPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21.5S5 14.9 5 9.8a7 7 0 0 1 14 0c0 5.1-7 11.7-7 11.7Z" />
    <circle cx="12" cy="9.8" r="2.6" />
  </svg>
);

export const IcClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IcArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IcArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
  </svg>
);

export const IcCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const IcSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export const IcFilter = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 5.5h17M6.5 12h11M10 18.5h4" />
  </svg>
);

export const IcMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h11" />
  </svg>
);

export const IcX = (p: P) => (
  <svg {...base(p)}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const IcShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.8 4.5 5.5v6c0 5 3.2 8 7.5 9.7 4.3-1.7 7.5-4.7 7.5-9.7v-6L12 2.8Z" />
    <path d="m8.8 11.8 2.3 2.3 4.1-4.6" />
  </svg>
);

export const IcTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 6.5H15V16H2.5zM15 10h3.5l3 3v3H15" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
);

export const IcTag = (p: P) => (
  <svg {...base(p)}>
    <path d="m3 3 8.5.5L21 13l-8 8L3.5 11.5 3 3Z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

export const IcFileCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 2.5h8L19 7.5v14H6z" />
    <path d="M14 2.5v5h5" />
    <path d="m9 14.5 2 2 4-4.5" />
  </svg>
);

export const IcCamera = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7.5h4l1.5-2.5h6L16.5 7.5h4V19h-17z" />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
);

export const categoryIcon = (key: IconKey, props?: P) => {
  switch (key) {
    case "drill":
      return <IcDrill {...props} />;
    case "crane":
      return <IcCrane {...props} />;
    case "helmet":
      return <IcHelmet {...props} />;
    case "wrench":
      return <IcWrench {...props} />;
    case "motor":
      return <IcMotor {...props} />;
    case "gear":
      return <IcGear {...props} />;
    case "hook":
      return <IcHook {...props} />;
    case "bolt":
      return <IcBolt {...props} />;
  }
};
