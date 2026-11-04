import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useContext} from "react";
import Pizza from "../Pizza";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponsesTypes";
import Cart from "../Cart";
import { CartContext } from "../contexts";

// intl untuk format angka menjadi bentuk currency.
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sizeLabelClass = "mx-3.75 mb-2.5 inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-[5px] border border-[#999] bg-border text-[#999] peer-checked:bg-white peer-checked:text-[#333] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";
export const Route = createLazyFileRoute("/order")({
  component: Order,
});

export function Order() {
  // hook itu ada: useState, useEffect, useRef, useLayoutEffect, use lain-lainnya.
  // useState return dua hal: contohnya: pizzaType (index ke-0) itu adalah value dari useState tersebut, sedangkan setPizzaType (index ke-1) merupakan fungsi untuk mengubah valuenya.
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("S");
  // tambah dua state: pizzaTypes untuk menyimpan hasil fetch pizza dari API
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  // melacak status loading.
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  async function checkout() {
    setLoading(true);

    // fetch
    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  let price: string | undefined;
  let selectedPizza : PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
    ? intl.format(
      selectedPizza.sizes[pizzaSize] )
      : undefined;
  }

  // useEffect ini menerima dua argumen, yaitu callback/fn dan dependencyList. Callback berisi fungsi ataupun hal yang ingin di lakukan saat halaman selesai di render dan jika ada variable didalam depList. Kalo deplist, itu merupakan list yang mengtrigger untuk menjalankan fungsi dalam callbacknya. Kalau arraynya kosong, maka dia akan dijalan sekali, saat halaman selesai di-render pertama kalinya. Kalau depListnya tidak disertakan, maka dia akan berjalan indefinitely.
  useEffect(() => {
    void fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    // delayer artifisial, akan dihapus kedepannya
    await new Promise((res) => setTimeout(res, 3000));

    const response = await fetch("/api/pizzas");
    const parsedJson = (await response.json()) as PizzaType[];
    setPizzaTypes(parsedJson);
    setLoading(false);
  }

  return (
    <div className="ml-[5%] w-full">
      <h2>Create Order</h2>
      <form
        className="flex justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selectedPizza || !price) {
            return;
          }
          setCart([
            ...cart, 
            { pizza: selectedPizza, size: pizzaSize, price },
          ]);
        }}
      >
        <div className="my-2.5 w-full border-r border-border p-3.75 text-center">
          <div className="my-2.5 text-center">
            <label 
              htmlFor="pizzaType"
              className="mb-2.5 block text-[20px] text-secondary"
            >
              Pizza Type:
            </label>
            <select
              className="form-select mb-7.5 block w-full py-1.25 pl-1.25 text-[16px]"
              name="pizzaType"
              onChange={(e) => setPizzaType(e.target.value)}
              value={pizzaType}
            >
              {pizzaTypes.map((pizza) => (
                <option key={pizza.id} value={pizza.id}>
                  {pizza.name}
                </option>
              ))}
            </select>
          </div>
          <div className="my-2.5 text-center">
          <label 
            htmlFor="pizzaSize"
            className="mb-2.5 block text-[20px] text-secondary"
            >
              Pizza Size:
            </label>
          <div className="my-2.5 text-center">
            <span>
              <input
                className="peer sr-only"
                checked={pizzaSize === "S"}
                onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                type="radio"
                id="pizza-s"
                name="pizza-size"
                value="S"
              />
              <label htmlFor="pizza-s" className={sizeLabelClass}>
                Small
              </label>
            </span>
            <span>
              <input
                className="peer sr-only"
                checked={pizzaSize === "M"}
                onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                type="radio"
                id="pizza-m"
                name="pizza-size"
                value="M"
              />
              <label htmlFor="pizza-m" className={sizeLabelClass}>
                Medium
              </label>
            </span>
            <span>
              <input
                className="peer sr-only"
                checked={pizzaSize === "L"}
                onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                type="radio"
                id="pizza-l"
                name="pizza-size"
                value="L"
              />
              <label htmlFor="pizza-l" className={sizeLabelClass}>
                Large
              </label>
            </span>
          </div>
        </div>
          <button 
            type="submit"
            className="inline-block cursor-pointer rounded-[5px] border border-primary bg-transparent px-3.75 py-1.25 font-pacifico text-[20px] text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-border disabled:opacity-50"
          >
            Add to cart
          </button>
        </div>
        {loading || !selectedPizza ? (
          <h3>Sedang memuat...</h3>
        ) : (
          <div className="my-2.5 ml-6.25 w-full p-3.75 text-center">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
      {loading ? (
        <h2>Sedang memuat...</h2>
      ) : (
        <Cart checkout={() => void checkout()} cart={cart} />
      )}
    </div>
  );
}