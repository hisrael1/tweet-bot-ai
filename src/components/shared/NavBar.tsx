import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-teal-600">PersonaFi</h1>
            </div>
          </Link>
          <div className="hidden md:flex space-x-8">
            <a href="https://harrison-israel-portfolio.vercel.app/" className="text-gray-600 hover:text-teal-600">
              About
            </a>
            {/* <a href="#" className="text-gray-600 hover:text-teal-600">
              Projects
            </a>
            <a href="#" className="text-gray-600 hover:text-teal-600">
              Contact
            </a> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
