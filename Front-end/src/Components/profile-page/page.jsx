import ProfileHeader from "../ProfileHeader";
import ProfileContent from "../ProfileContent";

export default function Page() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
