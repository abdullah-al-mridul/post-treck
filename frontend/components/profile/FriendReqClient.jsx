"use client";
import useFriendRequestsStore from "@/store/friendRequestsStore";
import React, { useEffect } from "react";
import Spinner from "../ui/Spinner";
import Image from "next/image";

const FriendReqClient = () => {
  const { friendRequests, loading, getFriendRequests, acceptFriendRequest } =
    useFriendRequestsStore();
  useEffect(() => {
    getFriendRequests();
  }, []);
  useEffect(() => {
    console.log(friendRequests);
  }, [friendRequests]);
  if (loading) {
    return <Spinner />;
  }
  if (friendRequests.length === 0) {
    return <div className="mt-[250px]">No friend requests</div>;
  }
  return (
    <div className="mt-[250px]">
      {friendRequests.map((request) => (
        <div key={request._id}>
          {request.profilePic !== "default-avatar.png" ? (
            <Image
              src={request.profilePic}
              alt={request.name}
              width={50}
              placeholder="blur"
              blurDataURL={request.profilePic}
              height={50}
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt=""
              className="w-[50px] h-[50px] rounded-full"
            />
          )}
          <h1>{request.name}</h1>
          <p>{request.email}</p>
          <button onClick={() => acceptFriendRequest(request._id)}>
            Accept
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendReqClient;
