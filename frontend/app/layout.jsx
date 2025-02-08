import { Roboto } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import SecureRoute from "@/components/SecureRoute";

//declare font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

//declare metadata
export const metadata = {
  title: "Post Treck",
  description: "Share your thoughts with the world",
};

//declare root layout
export default function RootLayout({ children }) {
  return (
    <RootLayoutClient>
      {/* checking if user is logged in */}
      <SecureRoute>
        {/* show main content */}
        <div className={`${roboto.variable} font-roboto`}>{children}</div>
      </SecureRoute>
    </RootLayoutClient>
  );
}
