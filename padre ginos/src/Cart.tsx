import type { CartItem } from "./contexts";

interface Props {
  cart: CartItem[];
  checkout: () => void;
}
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Cart({ cart, checkout }: Props) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const current = cart[i];
    total += current.pizza.sizes[current.size];
  }

  return (
    <div className="border-l border-border p-3.75 text-center leading-normal">
      <h2>Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            <span className="size">{item.size}</span>
            {" - "}
            <span className="type">{item.pizza.name}</span>
            {" - "}
            <span className="price">{item.price}</span>
          </li>
        ))}
      </ul>
      <p className="my-3.75">Total Price: {intl.format(total)}</p>
      <button 
        className= "inline-block cursor-pointer rounded-[5px] border border-primary bg-transparent px-3.75 py-1.25 font-pacifico text-[20px] text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-border disabled:opacity-50" 
        onClick={checkout}
      >
        Checkout
      </button>
    </div>
  );
}