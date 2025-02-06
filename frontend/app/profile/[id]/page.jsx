import ProfileClient from "@/components/ProfileClient";

// Metadata generation
export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Profile | Post Treck",
    description: "User profile and posts",
  };
}

// Page component
export default async function Page({ params }) {
  const { id } = await params;

  if (!id) {
    throw new Error("User ID is required");
  }

  return <ProfileClient userId={id} />;
}
