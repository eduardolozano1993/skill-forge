import { requireAuth } from "@/lib/auth";
import { ProfileSettingsPage } from "@/components/profile/profile-settings-page";

export default async function ProfilePage() {
  const session = await requireAuth();

  return <ProfileSettingsPage user={session.user} />;
}
