// components/Header.jsx
import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 py-4">
      <nav className="container mx-auto flex items-center justify-between">
        {/* <Link href="/" className="text-white font-bold text-xl">
          <img src="../../public/iit.png" alt="Logo" className="h-8" />
        </Link> */}
        <h4>Executive MIT</h4>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/notice" className="text-white hover:text-gray-300">
                Notice
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
