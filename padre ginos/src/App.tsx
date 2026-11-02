// import React from "react";
// import ReactDOM from "react-dom";

// const Pizza = (props) => {
//   return React.createElement("div", {}, [
//     React.createElement("h2", {}, props.name),
//     React.createElement("p", {}, props.description),
//   ]);
// };

// const App = () => {
//   return React.createElement("div", {}, [
//     React.createElement("h1", {}, "Pizza Menu"),

//     React.createElement(Pizza, {
//       name: "Margherita",
//       description:
//         "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.",
//     }),

//     React.createElement(Pizza, {
//       name: "Pepperoni",
//       description:
//         "Delicious pizza topped with pepperoni slices, tomato sauce, and mozzarella cheese.",
//     }),

//     React.createElement(Pizza, {
//       name: "Hawaiian",
//       description:
//         "Sweet and savory pizza topped with pineapple, ham, tomato sauce, and mozzarella cheese.",
//     }),
//   ]);
// };

// const container = document.getElementById("root");
// const root = ReactDOM.createRoot(container);

// root.render(React.createElement(App));



// import React from "react";
// import { StrictMode, useState } from "react";
// import { createRoot } from "react-dom/client"


// // import Pizza from "./Pizza.jsx";
// import Order from "./routes/Order.jsx";
// import PizzaOfTheDay from "./PizzaOfTheDay.jsx";
// import Header from "./Header.jsx";
// import { CartContext } from "./contexts.jsx";

// const App = () => {
//   const cartHook = useState([]);
//   return (
//     <StrictMode>
//       <CartContext.Provider value={cartHook}>
//       <Header />
//       <Order />
//       <PizzaOfTheDay />
//       </CartContext.Provider>
//       {/* <Pizza
//         name="Margherita"
//         description="Classic pizza with tomato sauce, mozzarella cheese, and fresh basil."
//         image={"/public/pizzas/mexicana.webp"}
//       />

//       <Pizza
//         name="Pepperoni"
//         description="Delicious pizza topped with pepperoni slices, tomato sauce, and mozzarella cheese."
//         image={"/public/pizzas/pepperoni.webp"}
//       />

//       <Pizza
//         name="Hawaiian"
//         description="Sweet and savory pizza topped with pineapple, ham, tomato sauce, and mozzarella cheese."
//         image={"/public/pizzas/big_meat.webp"}
//       /> */}
      
//     </StrictMode>
//   );
// };

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

const container = document.getElementById("root");
if (!container) {
  throw new Error("no container to reder to");
}
// routeTree itu hasil generate otomatis dari TanStack Router (isinya semua route di folder routes).
// createRouter mengubah routeTree tersebut jadi router yang siap dipakai.
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// QueryClient itu "otak" dari React Query: tempat menyimpan cache dan mengatur proses fetching data.
// Dibuat sekali di luar komponen supaya tidak terbuat ulang setiap App di-render.
const queryClient = new QueryClient();

const App = () => {
  return (
    // StrictMode memberikan extra warning dan hanya aktif saat development (di production tidak ada efeknya).
    // Karena itu, di development React akan menjalankan render/effect komponen kita dua kali untuk membantu menemukan bug.
    <StrictMode>
      {/* QueryClientProvider membagikan queryClient ke semua komponen, jadi useQuery bisa dipakai di mana saja */}
      <QueryClientProvider client={queryClient}>
        {/* RouterProvider yang menjalankan router: mencocokkan URL dengan route, lalu merender halamannya */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
};

const rootElement = document.getElementById("root");

const root = createRoot(container);
root.render(<App />); 

if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(<App />);