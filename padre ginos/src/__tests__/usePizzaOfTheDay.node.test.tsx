
import { expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import createFetchMock from "vitest-fetch-mock";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const testPizza = {
  id: "calabrese",
  name: "The Calabrese Pizza",
  category: "Supreme",
  description:
    "Salami, Pancetta, Tomatoes, Red Onions, Friggitello Peppers, Garlic",
  image: "/public/pizzas/calabrese.webp",
  sizes: { S: 12.25, M: 16.25, L: 20.25 },
};

// Test 1: Memeriksa nilai awal hook
test("to be null on initial load", () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));

  const { result } = renderHook(() => usePizzaOfTheDay());

  expect(result.current).toBeNull();
});

// Test 2: Memeriksa respons API
test("to call the API and give back the pizza of the day", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));

  const { result } = renderHook(() => usePizzaOfTheDay());

  await waitFor(() => {
    expect(result.current).toEqual(testPizza);
  });

  expect(fetchMocker).toHaveBeenCalledWith("/api/pizza-of-the-day");
});
