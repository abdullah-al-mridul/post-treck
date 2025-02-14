"use client";
import React, { useState } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
const MessageContainer = () => {
  const { selectedChat, sendMessage } = useMessages();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  console.log("selectedChat", selectedChat);
  let messages;
  if (selectedChat) {
    messages = selectedChat.messages;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message, selectedChat._id, file);
  };
  return (
    <div className="mt-[200px] w-full ml-[50px]">
      {selectedChat ? (
        <div>
          <div>
            {messages.map((message) => (
              <div
                className={`${
                  message.sender._id === user._id
                    ? "bg-green-200"
                    : "bg-blue-200"
                }`}
                key={message._id}
              >
                {message.media && (
                  <Image
                    height={100}
                    width={100}
                    placeholder="blur"
                    blurDataURL={message.media}
                    src={message.media}
                    alt="media"
                    className="w-10 h-10"
                  />
                )}
                {message.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              className="border-2 border-black"
              type="text"
              name="sendMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="sendMessage"
            />
            <button className="bg-green-200 p-2" type="submit">
              send
            </button>
          </form>
        </div>
      ) : (
        <div>no chat selected</div>
      )}
    </div>
  );
};

export default MessageContainer;
