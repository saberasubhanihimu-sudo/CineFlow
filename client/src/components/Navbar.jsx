import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, XIcon, TicketPlus } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const {favoriteMovies} = useAppContext();

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="logo" className="w-55 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 z-50 flex flex-col md:flex-row items-center gap-8
        max-md:h-screen backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20
        md:rounded-full md:px-8 py-3 overflow-hidden transition-all duration-300
        ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        <Link
          to="/"
          className="hover:bg-white/10 px-4 py-2 rounded-full transition"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Home
        </Link>

        <Link
          to="/movies"
          className="hover:bg-white/10 px-4 py-2 rounded-full transition"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Movies
        </Link>

         {favoriteMovies.length > 0 && <Link
          to="/favorite"
          className="hover:bg-white/10 px-4 py-2 rounded-full transition"
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Favorites
        </Link>}
      </div>

      <div className="flex items-center gap-8">
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="hidden sm:flex items-center gap-2 px-4 py-1 text-sm bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <TicketPlus size={16} />
              My Bookings
            </button>

            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Navbar;
