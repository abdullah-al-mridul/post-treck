import ProfileClient from "@/components/ProfileClient";

export const metadata = {
  title: "Profile | Post Treck",
  description: "User profile and posts",
};

//declare profile page
export default async function Profile({ params }) {
  //get id from params
  const { id } = await params;
  //if id is not found, show spinner
  if (!id) {
    return <Spinner />;
  }
  //show profile client component
  return <ProfileClient userId={id} />;
}
