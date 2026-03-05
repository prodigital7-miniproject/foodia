import { ReviewWrite } from "@/components/review/ReviewWrite";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rid } = await params;
  return <ReviewWrite rid={rid} />;
}
