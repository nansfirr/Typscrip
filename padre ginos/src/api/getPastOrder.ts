import type { PastOrderDetail } from "../APIResponsesTypes";

export default async function getPastOrder(
  order: number,
): Promise<PastOrderDetail> {
  const response = await fetch(`/api/past-order/${order}`);
  const data = (await response.json()) as PastOrderDetail;
  return data;
}