"use client";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
// import usePostStore from "@/store/postStore";
import { useEffect } from "react";

export default function HomeClient() {
  //   const { posts, loading, error, getPosts } = usePostStore();

  useEffect(() => {
    // getPosts();
  }, []);

  //   if (loading) return <div>Loading...</div>;
  //   if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div> */}
    </div>
  );
}
