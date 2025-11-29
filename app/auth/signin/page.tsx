// Sign-in page disabled. See `app/auth_disabled/signin` for the preserved UI.
export const dynamic = "force-dynamic";

export default function DisabledSignIn() {
  return (
    <div style={{ padding: 48, maxWidth: 720, margin: "64px auto" }}>
      <h2>Sign-in Disabled</h2>
      <p>
        The sign-in UI has been disabled here. For the preserved UI, visit
        <code style={{ display: "block", marginTop: 8 }}>/auth_disabled/signin</code>.
      </p>
    </div>
  );
}
