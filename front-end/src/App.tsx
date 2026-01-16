import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import HomePage from "./Pages/HomePage";
import AI from "./Pages/AI";
import Layout from "./Components/Layout";
import Mandelbrot from "./Pages/Mandelbrot";
import SortingVisualizer from "./Pages/SortingVisualizer";
import NotFoundPage from "./Pages/NotFoundPage";

const routes = [{
  path: "/",
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [{
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ai",
    element: <AI />,
  },
  {
    path: "/mandelbrot",
    element: <Mandelbrot />,
  },
  {
    path: "/sortingvisualizer",
    element: <SortingVisualizer />,
  }
]}];

const router = createBrowserRouter(routes, {
  basename: "/Projects/", // The base URL for all locations
});

export default function App() {
  return <RouterProvider router={router} />;
}
