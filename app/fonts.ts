import localFont from "next/font/local";

export const gilroy = localFont({
  src: [
    {
      path: "../fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
});

export const gilroyNpTitle = localFont({
  src: [
    {
      path: "../fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gilroy-np-title",
});

export default gilroy;
