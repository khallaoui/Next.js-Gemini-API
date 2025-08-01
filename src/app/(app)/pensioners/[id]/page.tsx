import PensionerDetailClient from "./_components/pensioner-detail-client";

export default function PensionerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PensionerDetailClient id={params.id} />;
}
