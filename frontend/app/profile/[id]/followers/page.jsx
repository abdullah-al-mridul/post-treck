import React from "react";
import FollowersPage from "@/components/profile/FollowersPage";

const page = async ({ params }) => {
  const { id } = await params;
  return <FollowersPage userId={id} />;
};

export default page;
