export default async function GoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <h1>
      Goal Page: <i>{id}</i>
    </h1>
  );
}
