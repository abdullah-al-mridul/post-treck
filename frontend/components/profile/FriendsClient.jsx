"use client";
import React, { useEffect } from "react";
import useFriendsStore from "@/store/friendsStore";
import Spinner from "../ui/Spinner";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

const FriendsClient = ({ userId }) => {
  const { friends, loading, getFriends } = useFriendsStore();
  useEffect(() => {
    getFriends(userId);
  }, []);
  useEffect(() => {
    console.log(friends);
  }, [friends]);
  if (loading) return <Spinner />;
  if (friends.length === 0) return <p>No friends found</p>;
  return (
    <div className="mt-[250px]">
      {friends.map((friend) => (
        <div key={friend._id}>
          {friend.profilePic !== "default-avatar.png" ? (
            <Image
              src={friend.profilePic}
              alt={friend.name}
              width={50}
              placeholder="blur"
              blurDataURL={friend.profilePic}
              height={50}
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt=""
              className="w-[50px] h-[50px] rounded-full"
            />
          )}
          <h1>{friend.name}</h1>
          <p>{friend.email}</p>
          <p>last active {formatDate(friend.lastActive)}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsClient;
