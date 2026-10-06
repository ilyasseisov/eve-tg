import localFont from "next/font/local";

//
// font declarations
//
export const customFont = localFont({
  src: [
    {
      path: "../public/fonts/regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom",
  display: "swap",
});

// single weight font
export const customFont2 = localFont({
  src: "../public/fonts/custom2.ttf",
  variable: "--font-custom2",
  display: "swap",
});
