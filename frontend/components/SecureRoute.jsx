"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

const publicRoutes = ["/auth/login", "/auth/register"];
const verificationRoutes = ["/auth/verification"];

export default function SecureRoute({ children }) {
  //get router, pathname and user
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  //check if user is logged in
  useEffect(() => {
    const handleRedirect = () => {
      // Case 1: No user trying to access protected route
      if (!user && !publicRoutes.includes(pathname)) {
        return "/auth/login";
      }

      // Case 2: User trying to access auth routes
      if (user && publicRoutes.includes(pathname)) {
        return "/";
      }

      // Case 3: Unverified user trying to access protected routes
      if (
        user &&
        !user.isVerified &&
        !verificationRoutes.includes(pathname) &&
        !publicRoutes.includes(pathname)
      ) {
        return "/auth/verification";
      }

      // Case 4: Verified user trying to access verification page
      if (user?.isVerified && verificationRoutes.includes(pathname)) {
        return "/";
      }

      // No redirect needed
      return null;
    };

    //get redirect to
    const redirectTo = handleRedirect();
    //if redirect to is not null, redirect to it
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [user, pathname, router]);

  // Show children only if:
  // 1. Public routes for non-authenticated users
  // 2. Verification page for unverified users
  // 3. Protected routes for verified users
  const shouldRenderChildren =
    (!user && publicRoutes.includes(pathname)) ||
    (user && !user.isVerified && verificationRoutes.includes(pathname)) ||
    (user &&
      user.isVerified &&
      !publicRoutes.includes(pathname) &&
      !verificationRoutes.includes(pathname));

  //return children if should render
  return shouldRenderChildren ? children : null;
}
