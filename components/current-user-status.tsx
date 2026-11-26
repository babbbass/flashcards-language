import { UserButton } from "@clerk/nextjs";
import { requireUser } from "@/lib/auth/current-user";

/**
 * TEMPORARY (step 4): shows the Clerk user menu and proves the user row exists in our DB.
 * Replaced by the real app header in step 6.
 */
export const CurrentUserStatus = async () => {
  const user = await requireUser();

  return (
    <div className="border-ink bg-card shadow-brutal-sm flex items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm">
      <UserButton />
      <span>
        Synced in DB · <code className="text-muted-foreground text-xs">{user.id}</code>
      </span>
    </div>
  );
};
