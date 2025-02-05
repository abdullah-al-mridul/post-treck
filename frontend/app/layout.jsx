import { Roboto } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "Post Treck",
  description: "Share your thoughts with the world",
};

export default function RootLayout({ children }) {
  return (
    <RootLayoutClient>
      <div className={`${roboto.variable} font-roboto`}>{children}</div>
    </RootLayoutClient>
  );
}
