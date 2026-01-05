import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import AI from "./Pages/AI";
import Layout from "./Layout";

const routes = [{
  path: "/",
  element: <Layout />,
  children: [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ai",
    element: <AI />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
]}];

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
