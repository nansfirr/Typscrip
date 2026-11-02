import { useContext } from "react";
import { Link } from "@tanstack/react-router";

import { CartContext } from "./contexts";

export default function Header() {
  const [cart] = useContext(CartContext);
  return (
    <nav>
      <Link to="/">
        <h1 className="logo">Padre Gino's Pizza</h1>
      </Link>
      <div className="nav-cart">
        🛒 <span className="nav-cart-number" data-testid="cart-number">
              {cart.length}
            </span>
      </div>
    </nav>
  );
}