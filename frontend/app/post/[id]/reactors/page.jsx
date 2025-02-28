import ReactorsClient from "@/components/post/reactors/ReactorsClient";
import React from "react";
export const metadata = {
  title: "Reactors | POST TRECK",
  description: "Reactors",
};
const page = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <ReactorsClient id={id} />
    </div>
  );
};

export default page;
