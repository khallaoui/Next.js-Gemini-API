import PensionerDetailClient from "./_components/pensioner-detail-client";

export default async function PensionerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PensionerDetailClient id={id} />;
}
