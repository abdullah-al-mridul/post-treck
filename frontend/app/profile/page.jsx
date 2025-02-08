"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";

export default function ProfileRedirect() {
  const router = useRouter();
  //get user from auth store
  const { user } = useAuthStore();

  //redirect to profile page if user is logged in
  useEffect(() => {
    if (user?._id) {
      router.replace(`/profile/${user._id}`);
    }
  }, [user, router]);

  //if user is not logged in, show spinner
  return <Spinner />;
}
