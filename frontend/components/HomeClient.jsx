"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import usePostStore from "@/store/postStore";
import useAuthStore from "@/store/authStore";
import { ArrowLeft, ArrowRight, Image, Plus, X } from "lucide-react";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // মাঝখানে কয়টা পেজ দেখাবে

  const getPages = () => {
    let pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-5">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border-2 border-black dark:border-darkBorder disabled:opacity-50 dark:text-zinc-100"
      >
        <ArrowLeft className="w-4 h-6" />
      </button>

      {/* Page Numbers */}
      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border-2 border-black dark:border-darkBorder ${
            currentPage === page
              ? "bg-white text-black dark:bg-darkBorder dark:text-zinc-100"
              : "bg-gray-800 text-white dark:bg-transparent dark:text-zinc-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis */}
      {currentPage + 2 < totalPages && <span className="px-3 py-2">...</span>}

      {/* Last Page */}
      {currentPage + 2 < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 border rounded bg-gray-800 text-white"
        >
          {totalPages}
        </button>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border-2 border-black dark:border-darkBorder disabled:opacity-50 dark:text-zinc-100"
      >
        <ArrowRight className="w-4 h-6" />
      </button>
    </div>
  );
};

export default function HomeClient() {
  //get posts, loading, error and getFeedPosts from post store
  const { posts, loading, error, getFeedPosts, createPost, pagination } =
    usePostStore();
  //get user from auth store
  useEffect(() => {
    console.log(pagination);
  }, [pagination]);
  const { user } = useAuthStore();
  //declare new post and is posting state
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  // Add new state for image
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Add ref for image input
  const imageInputRef = useRef(null);

  //get feed posts
  useEffect(() => {
    getFeedPosts(user._id, 1);
  }, []);

  // Handle image selection with validation
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    const validImages = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (validImages.length !== files.length) {
      alert("Some files are not images or exceed 5MB limit.");
    }

    setSelectedImages((prev) => [...prev, ...validImages]);
    setImagePreviews((prev) => [
      ...prev,
      ...validImages.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // Clear image selection
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && selectedImages.length === 0) return;

    try {
      setIsPosting(true);

      const formData = new FormData();
      formData.append("caption", newPost);
      selectedImages.forEach((image) => formData.append("media", image));
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const result = await createPost(formData);

      if (result) {
        setNewPost("");
        setSelectedImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  //if loading, show spinner
  // if (loading) return <Spinner />;
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 animate-pulse">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Create Post Section Skeleton */}
          <div className="bg-white dark:bg-[#15202B] border-2 border-gray-200 dark:border-gray-700">
            <div className="border-b-2 border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Posts Skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#15202B] border-2 border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //if error, show error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  //if not loading and no error, show home page
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Create Post Section */}
        <div className="bg-white dark:bg-transparent dark:hover:bg-[#38444d1a] border-2 border-black dark:border-darkBorder hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all">
          <div className="border-b-2 border-black dark:border-darkBorder p-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.profilePic || "/default-avatar.png"}
                alt={user?.name}
                className="w-12 h-12 rounded-none border-2 border-black dark:border-darkBorder"
              />
              <div className="flex-1">
                <h2 className="font-bold dark:text-zinc-100 text-lg">
                  {user?.name}
                </h2>
                <p className="text-black/50 dark:text-white/50 text-sm">
                  Share your thoughts
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="p-4 space-y-2">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-2 border-black dark:border-darkBorder dark:border-dashed p-4 rounded-none resize-none focus:outline-none min-h-[120px] placeholder:text-black/50 dark:placeholder:text-zinc-100 dark:text-zinc-100 font-medium"
              rows={3}
            />

            {/* Image Preview */}
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-auto border-2 border-black dark:border-darkBorder"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 dark:bg-darkBorder text-white p-1"
                  >
                    <X className="text-white dark:text-zinc-100 h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full mr-4">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 border-2 w-full flex border-dashed items-center justify-center border-black dark:border-darkBorder hover:bg-black hover:text-white dark:hover:bg-[#38444d36] dark:hover:text-black transition-colors"
                >
                  {selectedImages.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Plus className=" text-black dark:text-darkBorder" />
                      <p className="text-black/50 dark:text-darkBorder text-sm">
                        ({selectedImages.length}/10)
                      </p>
                    </div>
                  ) : (
                    <Image className=" text-black dark:text-darkBorder" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={
                  isPosting || (!newPost.trim() && selectedImages.length === 0)
                }
                className="px-8 py-2 bg-black text-white dark:bg-darkBorder dark:text-zinc-100 font-bold border-4 border-black dark:border-darkBorder hover:translate-x-[-4px] hover:translate-y-[-4px] active:translate-x-[0px] active:translate-y-[0px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isPosting ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    POSTING...
                  </div>
                ) : (
                  "POST"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 border-4 border-black dark:border-white p-8">
            <h2 className="text-2xl font-bold mb-4">NO POSTS YET</h2>
            <p className="text-black/50 dark:text-white/50">
              Be the first one to post something!
            </p>
          </div>
        )}
        <Pagination
          currentPage={pagination?.currentPage}
          totalPages={pagination?.totalPages}
          onPageChange={(page) => {
            getFeedPosts(user._id, page);
          }}
        />
      </div>
    </div>
  );
}
