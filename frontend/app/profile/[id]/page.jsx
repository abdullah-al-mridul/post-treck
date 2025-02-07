import ProfileClient from "@/components/ProfileClient";

export const metadata = {
  title: "Profile | Post Treck",
  description: "User profile and posts",
};

export default async function Profile({ params }) {
  const { id } = await params;
  if (!id) {
    return <Spinner />;
  }
  return <ProfileClient userId={id} />;
}
