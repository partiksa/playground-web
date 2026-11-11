import localFont from "next/font/local";

export const jakarta = localFont({
  src: "../fonts/PlusJakartaSans.woff2",
  weight: "200 800",
  display: "block",
  variable: "--f-jakarta",
  fallback: ["system-ui", "sans-serif"],
});

export const slinkee = localFont({
  src: "../fonts/Slinkee.woff",
  weight: "400",
  display: "block",
  variable: "--f-slinkee",
  fallback: ["sans-serif"],
});
