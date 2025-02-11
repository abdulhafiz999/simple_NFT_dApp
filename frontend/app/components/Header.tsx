"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, PhotoIcon, ArrowPathIcon, Bars3BottomRightIcon } from "@heroicons/react/24/outline";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "My NFTs",
    href: "/myNFTs",
    icon: <PhotoIcon className="h-4 w-4" />,
  },
  {
    label: "Transfers",
    href: "/transfers",
    icon: <ArrowPathIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition ${
                isActive ? "bg-secondary text-white shadow-md" : "hover:bg-secondary/80"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="sticky top-0 navbar bg-black min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-4">
      <div className="navbar-start mx-auto w-auto">
        <div className="lg:hidden dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-48"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {/* ✅ Improved Grid Layout with Three Columns */}
        <div className="grid grid-cols-3 w-full items-center">
          {/* ✅ Logo Section */}
          <Link href="/" passHref className="hidden lg:flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image alt="logo" className="cursor-pointer" fill src="/hack2.png" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white">HackerBoost</span>
              <span className="text-xs text-gray-400">Simple NFT DApp</span>
            </div>
          </Link>

          {/* ✅ Navigation Menu (Centered) */}
          <ul className="hidden lg:flex justify-center gap-4">
            <HeaderMenuLinks />
          </ul>

          {/* ✅ Right Section (Aligns Icon to Right) */}
          <div className="flex justify-end">
            <Bars3BottomRightIcon className="text-white h-6 w-6 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};
