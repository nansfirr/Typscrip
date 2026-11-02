// import { createContext } from "react";

// /**
//  * CartContext: context untuk berbagi data keranjang belanja ke seluruh komponen.
//  *
//  * Nilai default berupa tuple [cart, setCart], mirip hasil useState:
//  *   - elemen pertama: array kosong ([]) sebagai isi keranjang awal
//  *   - elemen kedua: fungsi kosong sebagai placeholder setter
//  *
//  * Nilai default ini hanya dipakai kalau komponen mengakses context
//  * di luar <CartContext.Provider>. Nilai aslinya diisi oleh Provider
//  * (biasanya dari useState di komponen App).
//  */

// export const CartContext = createContext([[], function () {}]);

import { createContext } from "react";
import type { Pizza, PizzaSize } from "./APIResponsesTypes";

export interface CartItem {
  pizza: Pizza;
  size: PizzaSize;
  price: string;
}

export const CartContext = createContext<
  [CartItem[], (cart: CartItem[]) => void]
>([[], () => {}]);