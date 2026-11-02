
import { afterEach, expect, test, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Order } from "../routes/order.lazy";
import { CartContext } from "../contexts";
import type { CartItem } from "../contexts";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("shows loading while fetching pizza types", () => {
  vi.useFakeTimers();

  vi.stubGlobal("fetch", vi.fn());

  const cart: CartItem[]= [];
  const setCart = vi.fn();

  render(
    <CartContext.Provider value={[cart, setCart]}>
      <Order />
    </CartContext.Provider>
  );

  expect(screen.getAllByText("Sedang memuat...")).toHaveLength(2);

  expect(fetch).not.toHaveBeenCalled();

  vi.clearAllTimers();
});

test("fetches pizza types after loading delay", async () => {
  const pizzas = [
    {
      id: "pepperoni",
      name: "The Pepperoni Pizza",
      category: "Classic",
      description: "Mozzarella Cheese, Pepperoni",
      image: "",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
  ];

  const fetchMock = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue(pizzas),
  });

  vi.stubGlobal("fetch", fetchMock);

  render(
    <CartContext.Provider value={[[], vi.fn()]}>
      <Order />
    </CartContext.Provider>
  );

  expect(screen.getAllByText("Sedang memuat...")).toHaveLength(2);

  await vi.waitFor(
    () => {
      expect(fetchMock).toHaveBeenCalledWith("/api/pizzas");
    },
    { timeout: 5000 }
  );

  // Memastikan nama pizza tampil pada heading detail pizza.
    expect(
    await screen.findByRole("heading", {
        level: 1,
        name: "The Pepperoni Pizza",
    })
    ).toBeTruthy();
});


test("adds selected pizza to cart", async () => {
  const pizzas = [
    {
      id: "pepperoni",
      name: "The Pepperoni Pizza",
      category: "Classic",
      description: "Mozzarella Cheese, Pepperoni",
      image: "",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
  ];

  const fetchMock = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue(pizzas),
  });

  vi.stubGlobal("fetch", fetchMock);

  const cart: CartItem [] = [];
  const setCart = vi.fn();

  render(
    <CartContext.Provider value={[cart, setCart]}>
      <Order />
    </CartContext.Provider>
  );

  // Tunggu sampai data pizza selesai dimuat
  await screen.findByRole(
    "heading",
    {
        level: 1,
        name: "The Pepperoni Pizza",
    },
    { timeout: 5000 }
 );

  // Klik tombol Add to cart
  fireEvent.click(
    screen.getByRole("button", {
        name: /add to cart/i,
    })
  );

  // Pastikan setCart dipanggil
  expect(setCart).toHaveBeenCalledWith([
    {
      pizza: pizzas[0],
      size: "S",
      price: "$9.75",
    },
  ]);
});


test("adds selected medium pizza to cart with correct price", async () => {
  const pizzas = [
    {
      id: "pepperoni",
      name: "The Pepperoni Pizza",
      category: "Classic",
      description: "Mozzarella Cheese, Pepperoni",
      image: "",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
  ];

  const fetchMock = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue(pizzas),
  });

  vi.stubGlobal("fetch", fetchMock);

  const setCart = vi.fn();

  render(
    <CartContext.Provider value={[[], setCart]}>
      <Order />
    </CartContext.Provider>
  );

  await screen.findByRole(
    "heading",
    {
      level: 1,
      name: "The Pepperoni Pizza",
    },
    { timeout: 5000 }
  );

  fireEvent.click(screen.getByLabelText("Medium"));

  fireEvent.click(
    screen.getByRole("button", {
      name: /add to cart/i,
    })
  );

  expect(setCart).toHaveBeenCalledWith([
    {
      pizza: pizzas[0],
      size: "M",
      price: "$12.50",
    },
  ]);
});


test("checks out cart and clears it", async () => {
  const pizzas = [
    {
      id: "pepperoni",
      name: "The Pepperoni Pizza",
      category: "Classic",
      description: "Mozzarella Cheese, Pepperoni",
      image: "",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
  ];

  const fetchMock = vi.fn()
    .mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(pizzas),
    })
    .mockResolvedValueOnce({});

  vi.stubGlobal("fetch", fetchMock);

  const cart: CartItem[] = [
    {
      pizza: pizzas[0],
      size: "S",
      price: "$9.75",
    },
  ];

  const setCart = vi.fn();

  render(
    <CartContext.Provider value={[cart, setCart]}>
      <Order />
    </CartContext.Provider>
  );

  // Tunggu sampai data pizza selesai dimuat
  await screen.findByRole(
    "heading",
    {
      level: 1,
      name: "The Pepperoni Pizza",
    },
    { timeout: 5000 }
  );

  // Klik tombol Checkout
  fireEvent.click(
    screen.getByRole("button", {
      name: /checkout/i,
    })
  );

  // Pastikan request POST dikirim
  await vi.waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      }
    );
  });

  // Pastikan cart dikosongkan
  await vi.waitFor(() => {
    expect(setCart).toHaveBeenCalledWith([]);
 });

    // Pastikan loading selesai
  await vi.waitFor(() => {
    expect(
        screen.queryAllByText("Sedang memuat...")
    ).toHaveLength(0);
 });
});
