import React from "react";
import PostClient from "@/components/post/PostClient";
import Spinner from "@/components/ui/Spinner";
const page = async ({ params }) => {
  const { id } = await params;
  if (!id) {
    return <Spinner />;
  }
  return <PostClient id={id} />;
};

export default page;
