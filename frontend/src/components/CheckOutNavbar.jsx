import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const CheckoutNavbar = () => {
  return (
    <nav className="bg-black w-full mt-[70px] py-14 px-4  md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Back to shopping bag */}
          <div className="flex items-center">
            <Link
              to="/shopping-bag"
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-300"
            >
              <FiArrowLeft className="mr-2 text-lg  md:text-xl group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline text-sm font-thin uppercase  md:text-base  md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">
                Back to shopping bag
              </span>
              <span className="sm:hidden text-sm font-thin uppercase  md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">
                Back
              </span>
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="block">
              <img
                src="/images/LA-2.png"
                alt="Brand Logo"
                className="h-10  md:h-14"
              />
            </Link>
          </div>

          {/* Right: Contact */}
          <div className="text-white text-sm  md:text-base  md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-thin">
            <a
              href="tel:+2348161656841"
              className="hidden sm:block hover:text-gray-300 transition-colors duration-300"
            >
              +234 816 165 6841
            </a>
            <a
              href="tel:+2348161656841"
              className="sm:hidden"
              aria-label="Contact"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CheckoutNavbar;
