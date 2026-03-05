import { ReviewWrite } from "@/components/review/ReviewWrite";

export default async function Page({ params }: { params: { id: string } }) {
  const rid = await params.id;
  return <ReviewWrite rid={rid} />;
}
