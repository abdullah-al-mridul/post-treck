"use client";
import React, { useEffect } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
const ChatSideBar = () => {
  const { loading, userChats, getUserChats, setSelectedChat } = useMessages();
  const { user } = useAuthStore();
  useEffect(() => {
    getUserChats();
  }, []);
  useEffect(() => {
    console.log(userChats);
  }, [userChats]);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="mt-[200px] min-w-[320px]">
      <div className="flex flex-col gap-4 bg-black p-2">
        {userChats.map((chat) => {
          function detectWhichParticipant(chat) {
            let participant;
            chat.participants.forEach((participantParam) => {
              if (participantParam._id !== user._id) {
                participant = participantParam;
              }
            });
            return participant;
          }
          const participant = detectWhichParticipant(chat);
          return (
            <div
              onClick={() => setSelectedChat(chat)}
              key={chat._id}
              className=" max-w-[320px]"
            >
              <div className="flex items-center gap-2 bg-green-200 max-w-full p-1">
                <img
                  src={participant.profilePic}
                  className="h-10 w-10 rounded-full"
                  alt=""
                />
                <div>
                  <h3>{participant.name}</h3>
                  {/* <p>{chat.messages[chat.messages.length - 1]?.content}</p> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSideBar;
