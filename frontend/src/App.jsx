import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Loginsignup from "./Pages/Loginsignup";
import Shopcatagory from "./Pages/Shopcatagory";
import Payment from "./Pages/Payment";
import Success from "./Pages/Success";

import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigation,
} from "react-router-dom";

// Minimal Loader using Tailwind
function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Layout Component with loader for initial load + route transitions
function Layout() {
  const navigation = useNavigation();
  const [initialLoading, setInitialLoading] = React.useState(true);

  // Hide initial loader after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const isLoading =
    initialLoading || navigation.state === "loading" || navigation.state === "submitting";

  return (
    <>
      <Navbar />
      {isLoading ? <Loader /> : <Outlet />}
      <Footer />
    </>
  );
}

// Helper function for artificial delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Router configuration with artificial delay in loaders
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: async () => {
      await delay(300); // artificial delay for initial page
      return null;
    },
    children: [
      { index: true, element: <Shop />, loader: async () => await delay(300) },
      { path: "men", element: <Shopcatagory banner={men_banner} catagory="men" />, loader: async () => await delay(300) },
      { path: "women", element: <Shopcatagory banner={women_banner} catagory="women" />, loader: async () => await delay(300) },
      { path: "kids", element: <Shopcatagory banner={kid_banner} catagory="kids" />, loader: async () => await delay(300) },
      { path: "product/:productid", element: <Product />, loader: async () => await delay(300) },
      { path: "cart", element: <Cart />, loader: async () => await delay(300) },
      { path: "login", element: <Loginsignup />, loader: async () => await delay(300) },
      { path: "paymentgateway", element: <Payment />, loader: async () => await delay(300) },
      { path: "success", element: <Success />, loader: async () => await delay(300) },
    ],
  },
]);

// App Component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
