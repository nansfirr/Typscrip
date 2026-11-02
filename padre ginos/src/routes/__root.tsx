import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { CartContext, type CartItem } from "../contexts";
import Header from "../Header";
import PizzaOfTheDay from "../PizzaOfTheDay";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import {ReactQueryDevtools } from "@tanstack/react-query-devtools";

// createRootRoute itu route paling atas, jadi layout di sini dipakai oleh semua halaman.
export const Route = createRootRoute({
  component: () => {
    // useState return dua hal: cart (index ke-0) sebagai value-nya, dan setCart (index ke-1) sebagai fungsi untuk mengubahnya.
    // Di sini keduanya sengaja tidak dipecah, langsung disimpan utuh sebagai cartHook.
    const cartHook = useState<CartItem[]>([]);

    return (
      <>
        {/* Provider membagikan cartHook ke semua komponen di dalamnya.
            Jadi halaman mana pun bisa pakai useContext(CartContext) untuk baca atau ubah keranjang. */}
        <CartContext.Provider value={cartHook}>
          <div>
            {/* Header dan PizzaOfTheDay tampil di setiap halaman */}
            <Header />
            {/* Outlet itu tempat halaman sesuai URL dirender */}
            <Outlet />
            <PizzaOfTheDay />
          </div>
        </CartContext.Provider>

        {/* Devtools cuma alat bantu debugging routing saat development */}
        <TanStackRouterDevtools />
        {/* <ReactQueryDevtools /> */}
      </>
    );
  },
});