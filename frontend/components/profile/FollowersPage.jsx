"use client";
import React, { useEffect } from "react";
import useFollowersStore from "@/store/followersStore";
import Spinner from "../ui/Spinner";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";

const FollowersPage = ({ userId }) => {
  const { followers, loading, getFollowers } = useFollowersStore();
  useEffect(() => {
    getFollowers(userId);
  }, [userId]);
  console.log(followers);
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className=" mt-[250px]">
      {followers.map((follower) => (
        <div key={follower?._id}>
          <div>
            {follower?.profilePic !== "default-avatar.png" ? (
              <Image
                className="rounded-full"
                width={50}
                height={50}
                placeholder="blur"
                blurDataURL={follower?.profilePic}
                src={follower?.profilePic}
                alt="profile"
              />
            ) : (
              <img
                src="/default-avatar.png"
                className="rounded-full w-[50px] h-[50px]"
                alt=""
              />
            )}
            <p>{follower?.name}</p>
            <p>{follower?.email}</p>
            <p>last active {formatDate(follower?.lastActive)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowersPage;
