import FriendsClient from "@/components/profile/FriendsClient";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <FriendsClient userId={id} />
    </div>
  );
};

export default page;
