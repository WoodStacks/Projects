import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="navbar w-auto p-[0px]">
      <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/">
        Home
      </Link>
      <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/ai">
        AI
      </Link>
      <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/mandelbrot">
        Mandelbrot
      </Link>
      <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/about">
        About
      </Link>
    </div>
  );
}
