import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import Header from "../Header";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
} from "@tanstack/react-router";
import { CartContext } from "../contexts";
import type { CartItem } from "../contexts";
import type { Pizza } from "../APIResponsesTypes";

const testPizza: Pizza = {
  id: "pepperoni",
  name: "The Pepperoni Pizza",
  category: "Classic",
  description: "Mozzarella Cheese, Pepperoni",
  image: "/public/pizzas/pepperoni.webp",
  sizes: { S: 9.75, M: 12.5, L: 15.25 },
};

const threeItems: CartItem[] = [
  { pizza: testPizza, size: "S", price: "$9.75" },
  { pizza: testPizza, size: "M", price: "$12.50" },
  { pizza: testPizza, size: "L", price: "$15.25" },
];

test("correctly renders a header with a zero cart count", async () => {
  const rootRoute = createRootRoute({
    component: () => (
      <CartContext.Provider value={[[], () => {}]}>
        <Header />
      </CartContext.Provider>
    ),
  });

  const router = createRouter({ routeTree: rootRoute });
  const screen = render(
    <RouterProvider<typeof router> router={router}></RouterProvider>,
  );

  const itemsInCart = screen.getByTestId("cart-number");

  await expect.element(itemsInCart).toBeInTheDocument();
  await expect.element(itemsInCart).toHaveTextContent("0");
});

test("correctly renders a header with a three cart count", async () => {
  const rootRoute = createRootRoute({
    component: () => (
      <CartContext.Provider value={[threeItems, () => {}]}>
        <Header />
      </CartContext.Provider>
    ),
  });

  const router = createRouter({ routeTree: rootRoute });
  const screen = render(
    <RouterProvider<typeof router> router={router}></RouterProvider>,
  );

  const itemsInCart = screen.getByTestId("cart-number");

  await expect.element(itemsInCart).toBeInTheDocument();
  await expect.element(itemsInCart).toHaveTextContent("3");
});