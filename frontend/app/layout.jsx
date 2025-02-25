import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import SecureRoute from "@/components/SecureRoute";
import BanReasonModal from "@/components/dashboard/users/BanReasonModal";

const inter = Inter({ subsets: ["latin"] });

//declare metadata
export const metadata = {
  title: "Post Treck",
  description: "A social media platform",
};

//declare root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>
          {/* checking if user is logged in */}
          <SecureRoute>
            {/* show main content */}
            <div>{children}</div>
          </SecureRoute>
        </RootLayoutClient>
        <BanReasonModal />
      </body>
    </html>
  );
}
