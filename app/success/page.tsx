export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <main
      style={{
        padding: 24,
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        maxWidth: 720,
      }}
    >
      <h1>Success 🎉</h1>
      <p>Thanks for your purchase.</p>
      {searchParams?.session_id && (
        <p>
          Stripe session: <code>{searchParams.session_id}</code>
        </p>
      )}
    </main>
  );
}
