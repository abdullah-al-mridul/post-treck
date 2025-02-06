"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import Header from "@/components/Header";

export default function HomeClient() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <CreatePost />

          {/* Posts */}
          {[1, 2, 3].map((post) => (
            <PostCard
              key={post}
              post={{
                id: post,
                author: {
                  name: "John Doe",
                  avatar: "https://via.placeholder.com/48",
                },
                content: "This is a sample post content with some real text...",
                image: "https://via.placeholder.com/600x400",
                createdAt: "2 hours ago",
                likes: 2500,
                comments: 123,
                shares: 45,
              }}
            />
          ))}
        </div>
      </main>

      <ThemeToggle />
    </div>
  );
}
