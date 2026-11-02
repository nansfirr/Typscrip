import type { PastOrder } from "../APIResponsesTypes";

export default async function getPastOrders(
  page: number,
): Promise<PastOrder[]> {
  const response = await fetch(`/api/past-orders?page=${page}`);
  const data = (await response.json()) as PastOrder[];
  return data;
}