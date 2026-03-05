import { RestaurantDetail } from "@/components/restaurant/RestaurantDetail";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <RestaurantDetail rid={id} />;
}
