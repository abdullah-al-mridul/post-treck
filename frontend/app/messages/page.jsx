import React from "react";
import ChatSideBar from "@/components/messages/ChatSideBar";
import MessageContainer from "@/components/messages/MessageContainer";
export const metadata = {
  title: "Messages | Post Treck",
  description: "Messages page",
};
const page = () => {
  return (
    <div className="flex">
      <ChatSideBar />
      <MessageContainer />
    </div>
  );
};

export default page;
