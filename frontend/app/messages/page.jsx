import React from "react";
import ChatSideBar from "@/components/messages/ChatSideBar";
import MessageContainer from "@/components/messages/MessageContainer";

export const metadata = {
  title: "Messages | Post Treck",
  description: "Messages page",
};

const MessagesPage = () => {
  return (
    <div className="flex min-h-screen max-h-screen border-2 border-darkBorder border-b-0 border-t-0 max-w-[1200px] mx-auto pt-16">
      <div className="w-[320px] border-r-2 border-black dark:border-darkBorder">
        <ChatSideBar />
      </div>
      <div className="flex-1">
        <MessageContainer />
      </div>
    </div>
  );
};

export default MessagesPage;
