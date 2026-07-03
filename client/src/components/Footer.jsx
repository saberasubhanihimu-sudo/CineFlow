import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-500 pb-14 items-start">
        
        <div className="flex flex-col items-start text-left">
          <img
            src={assets.logo}
            alt="logo"
            className="h-24 w-auto object-contain"
          />

          <p className="mt-6 text-sm leading-relaxed">
            Where every story begins with a click. <br />
            Discover handpicked films, reserve your seat, and immerse yourself
            in the seamless flow of cinema.
          </p>

          <div className="flex items-center gap-2 mt-6">
            <img
              src={assets.googlePlay}
              alt="google play"
              className="h-9 w-auto"
            />
            <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
          </div>
        </div>

       
        <div className="flex flex-col items-start md:items-center mt-6 md:mt-10">
          <h2 className="font-semibold mb-5">Company</h2>
          <ul className="text-sm space-y-2">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>

        
        <div className="flex flex-col items-start md:items-end mt-6 md:mt-10">
          <h2 className="font-semibold mb-5">Get in touch</h2>
          <div className="text-sm space-y-2">
            <p>+1-234-567-890</p>
            <p>cineflow@gmail.com</p>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © CineFlow. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
