import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <>
      <div className="h-full flex flex-col bg-base-100">
        <div className="flex justify-center">
          <NavBar />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}
