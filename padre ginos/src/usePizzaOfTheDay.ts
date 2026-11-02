import { useState, useEffect, useDebugValue } from "react";
import type { Pizza } from "./APIResponsesTypes";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState<Pizza | null>(null);

  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      const response = await fetch("/api/pizza-of-the-day");
      const data = (await response.json()) as Pizza;
      setPizzaOfTheDay(data);
    }

    void fetchPizzaOfTheDay();
  }, []);

  return pizzaOfTheDay;
};