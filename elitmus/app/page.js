export default async function TestPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`,
    { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } }
  );
  const data = await res.json();

  return (
    <pre className="p-8">
      Status: {res.status}
      {"\n"}
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}