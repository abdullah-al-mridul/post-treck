"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      router.replace(`/profile/${user._id}`);
    }
  }, [user, router]);

  return <Spinner />;
}
