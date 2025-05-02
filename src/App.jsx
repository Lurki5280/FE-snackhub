import React from "react"
import { createBrowserRouter,RouterProvider} from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail"
import Popular from "./pages/Popular"
import Profile from "./pages/Profile"
import CartPage from "./pages/CartPage"
import Order from "./pages/Order"
import OrderDetail from "./pages/OrderDetail"
import OrderSuccess from "./pages/OrderSuccess"
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import About from './pages/About';

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {   path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/popular",
        element: <Popular />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetail />,
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "/faqs",
        element: <FAQs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/shipping",
        element: <Shipping />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ]
  }
]);
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App
