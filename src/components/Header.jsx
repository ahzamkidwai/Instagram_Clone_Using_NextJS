import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className=" shadow-sm border-b stciky top-0 bg-white z-30 p-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="hidden lg:inline-flex">
            <Image src="instagram.svg" height={96} width={96} alt="instagram" />
          </Link>

          <Link href="/" className="lg:hidden inline-flex">
            <Image
              src="instagram-logo.svg"
              height={40}
              width={40}
              alt="instagram-logo"
            />
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px] focus:border-gray-500 focus:outline-none"
        />

        <button className="text-sm font-semibold text-blue-500 ">
          Log In
        </button>
      </div>
    </div>
  );
};

export default Header;
