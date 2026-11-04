import { skipToken, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import ErrorBoundary from "../ErrorBoundary";
// import type { PastOrder, PastOrderDetail } from "../APIResponsesTypes";


const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrdersRoute,
});

function ErrorBoundaryWrappedPastOrdersRoute() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}
function PastOrdersRoute() {
  // useState<number>() tanpa nilai awal = number | undefined:
  // belum ada pesanan yang dipilih, atau nomor pesanan yang dipilih.
  const [focusedOrder, setFocusedOrder] = useState<number>();

  //throw new Error("test"); // tambaahkan sementara
  
  // state untuk menyimpan halaman yang sedang dibuka, dimulai dari halaman 1.
  // page (index ke-0) itu value-nya, setPage (index ke-1) fungsi untuk mengubahnya.
  const [page, setPage] = useState(1);

  const { data: focusedOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    queryFn: focusedOrder ? () => getPastOrder(focusedOrder) : skipToken,
    staleTime: 24 * 60 * 60 * 1000,
  });

  // useQuery dari React Query dipakai untuk mengambil data dari server (fetching) sekaligus mengelola cache-nya.
  // Hasilnya berupa object, di sini kita ambil isLoading (true selama data pertama kali diambil) dan data (hasil dari queryFn).
  const { isLoading, data } = useQuery({
    // queryKey itu "identitas" cache untuk query ini.
    // Karena ada page di dalamnya, tiap halaman punya cache sendiri, dan setiap page berubah, query otomatis jalan lagi.
    queryKey: ["past-orders", page],

    // queryFn itu fungsi yang benar-benar mengambil data, di sini getPastOrders sesuai halaman yang aktif.
    queryFn: () => getPastOrders(page),

    // staleTime: berapa lama (dalam milidetik) data dianggap masih "fresh".
    // 30000 ms = 30 detik, selama itu React Query memakai cache dan tidak fetch ulang ke server.
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>Sedang memuat...</h2>
      </div>
    );
  }

  // Setelah loading selesai, data masih bisa undefined kalau request gagal.
  // Kita nyatakan eksplisit: biar ErrorBoundary yang menangani.
  if (!data) {
    throw new Error("Past orders could not be loaded");
  }

  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order # {focusedOrder}</h2>
          {focusedOrderData ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {focusedOrderData.orderItems.map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.name}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Sedang memuat...</p>
          )}
          <button onClick={() => setFocusedOrder(undefined)}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}

// import { useQuery } from "@tanstack/react-query";
// import { createLazyFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import getPastOrders from "../api/getPastOrders";
// import getPastOrder from "../api/getPastOrder";
// import Modal from "../Modal";
// import ErrorBoundary from "../ErrorBoundary";
// import type { PastOrder, PastOrderDetail } from "../APIResponsesTypes";

// const intl = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
// });

// export const Route = createLazyFileRoute("/past")({
//   component: ErrorBoundaryWrappedPastOrdersRoute,
// });

// function ErrorBoundaryWrappedPastOrdersRoute() {
//   return(
//     <ErrorBoundary>
//       <PastOrdersRoute />
//     </ErrorBoundary>
//   )
// }
// function PastOrdersRoute() {
//   const [focusedOrder, setFocusedOrder] = useState<number>();
  
//   // throw new Error("");
  
//   // state untuk menyimpan halaman yang sedang dibuka, dimulai dari halaman 1.
//   // page (index ke-0) itu value-nya, setPage (index ke-1) fungsi untuk mengubahnya.
//   const [page, setPage] = useState(1);

//   const { isLoading: isLoadingFocusedOrder, data: focusedOrderData } = useQuery(
//     {
//       queryKey: ["past-order", focusedOrder],
//       queryFn: () => getPastOrder(focusedOrder),
//       enabled: !!focusedOrder,
//       staleTime: 24 * 60 * 60 * 1000,
//     },
//   );

//   // useQuery dari React Query dipakai untuk mengambil data dari server (fetching) sekaligus mengelola cache-nya.
//   // Hasilnya berupa object, di sini kita ambil isLoading (true selama data pertama kali diambil) dan data (hasil dari queryFn).
//   const { isLoading, data } = useQuery({
//     // queryKey itu "identitas" cache untuk query ini.
//     // Karena ada page di dalamnya, tiap halaman punya cache sendiri, dan setiap page berubah, query otomatis jalan lagi.
//     queryKey: ["past-orders", page],

//     // queryFn itu fungsi yang benar-benar mengambil data, di sini getPastOrders sesuai halaman yang aktif.
//     queryFn: () => getPastOrders(page),

//     // staleTime: berapa lama (dalam milidetik) data dianggap masih "fresh".
//     // 30000 ms = 30 detik, selama itu React Query memakai cache dan tidak fetch ulang ke server.
//     staleTime: 30000,
//   });

//   if (isLoading) {
//     return (
//       <div className="past-orders">
//         <h2>Sedang memuat...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="past-orders">
//       <table>
//         <thead>
//           <tr>
//             <td>ID</td>
//             <td>Date</td>
//             <td>Time</td>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((order) => (
//             <tr key={order.order_id}>
//               <td>
//                 <button onClick={() => setFocusedOrder(order.order_id)}>
//                   {order.order_id}
//                 </button>
//               </td>
//               <td>{order.date}</td>
//               <td>{order.time}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="pages">
//         <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
//           Previous
//         </button>
//         <div>{page}</div>
//         <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
//           Next
//         </button>
//       </div>
//       {focusedOrder ? (
//         <Modal>
//           <h2>Order # {focusedOrder}</h2>
//           {!isLoadingFocusedOrder ? (
//             <table>
//               <thead>
//                 <tr>
//                   <td>Image</td>
//                   <td>Name</td>
//                   <td>Size</td>
//                   <td>Quantity</td>
//                   <td>Price</td>
//                   <td>Total</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {focusedOrderData.orderItems.map((pizza) => (
//                   <tr key={`${pizza.pizzaTypeId}_${pizza.name}`}>
//                     <td>
//                       <img src={pizza.image} alt={pizza} />
//                     </td>
//                     <td>{pizza.name}</td>
//                     <td>{pizza.size}</td>
//                     <td>{pizza.quantity}</td>
//                     <td>{intl.format(pizza.price)}</td>
//                     <td>{intl.format(pizza.total)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>Sedang memuat...</p>
//           )}
//           <button onClick={() => setFocusedOrder()}>Close</button>
//         </Modal>
//       ) : null}
//     </div>
//   );
// }