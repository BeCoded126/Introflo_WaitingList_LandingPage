// This auth route has been disabled. The active implementation was moved to
// `app/auth_disabled` to prevent Next.js from prerendering these auth pages.
export const dynamic = "force-dynamic";

export default function DisabledAuthPage() {
  return (
    <div style={{ padding: 48, maxWidth: 720, margin: "64px auto" }}>
      <h2>Authentication Disabled</h2>
      <p>
        The authentication routes have been disabled in this workspace. If you
        need to access the previous auth UI for debugging, visit
        <code style={{ display: "block", marginTop: 8 }}>/auth_disabled</code>.
      </p>
    </div>
  );
}
