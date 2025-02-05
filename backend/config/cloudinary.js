import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post-treck/profile-pics",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "fill" }],
  },
});

const coverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post-treck/cover-photos",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1200, height: 400, crop: "fill" }], // Wider aspect ratio for cover photos
  },
});

const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post-treck/posts",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
    resource_type: "auto", // Allows both images and videos
  },
});

// Add chat media storage configuration
const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "post-treck/chat-media",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Multer upload middleware
export const upload = multer({ storage: storage });
export const coverUpload = multer({ storage: coverStorage });
export const postUpload = multer({
  storage: postStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const chatUpload = multer({
  storage: chatStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default cloudinary;
