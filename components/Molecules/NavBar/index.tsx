"use client";

import { IUsersDocument } from "@/models/user";
import { navOptions } from "@/utils/NavConstants";
import { CommonApplicationLogo } from "../../Atoms/LogoImage";
import SearchedDataListed from "@/components/Molecules/Searched";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/Wrapper/universalState";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import axios from "axios";

const CommonNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedUserData } = useAuth() as { selectedUserData: IUsersDocument };

  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductname] = useState("");
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const isAuthenticationPage = pathname === "/authentication";
  const clearSearchText = () => setProductname("");

  const isUserAuthenticated = useMemo(() => !!selectedUserData?.email, [selectedUserData]);

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchUserAddresses();
    }
  }, [isUserAuthenticated]);

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`/api/useraddress?userId=${selectedUserData.id}`);
      setUserAddresses(response.data);
      setSelectedAddress(response.data[0]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
    setShowAddressDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg transition-all duration-300 ease-in-out backdrop-blur-md">
      <div className="flex flex-row items-center justify-between gap-6 w-full max-w-[1280px] mx-auto p-4">
        <span className="xl:block hidden">
          <CommonApplicationLogo />
        </span>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex flex-row items-center justify-between w-full gap-8">
          {!isAuthenticationPage && (
            <div className="relative w-[16em]">
              <input
                className="h-[2.5em] px-2 rounded-md border-2 border-gray-300 focus:border-blue-400 outline-none"
                type="text"
                placeholder="Search Products..."
                value={productName}
                onChange={(e) => setProductname(e.target.value)}
              />
              <button className="absolute right-0 h-[2.5em] px-2">
                {!productName.length ? (
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="green" className="text-slate-500">
                    <g>
                      <path fillRule="evenodd" d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14" />
                      <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                    </g>
                  </svg>
                ) : (
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="red" className="cursor-pointer" onClick={clearSearchText}>
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Location Dropdown */}
          <div className="relative">
  {isUserAuthenticated && (
    <div
      className="flex items-center gap-4 w-[14rem] py-2 px-3 bg-green-900 text-white rounded-md cursor-pointer"
      onClick={() => setShowAddressDropdown(!showAddressDropdown)}
    >
      <svg width="2rem" height="2rem" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a5 5 0 0 0-5 5c0 5 5 11 5 11s5-6 5-11a5 5 0 0 0-5-5m0 8a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
      </svg>
      <div className="truncate-2-lines">
        {selectedAddress
          ? `${selectedAddress?.doorNumber}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.pinNumber}`
          : "Select Location"}
      </div>
    </div>
  )}
  {showAddressDropdown && (
    <div className="absolute top-16 left-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
      {userAddresses.map((address, index) => (
        <div
          key={index}
          className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 truncate-2-lines"
          onClick={() => handleSelectAddress(address)}
          title={`${address.street}, ${address.city}`}
        >
          {`${address.doorNumber}, ${address.street}, ${address.city},${address.pinNumber}`}
        </div>
      ))}
      <div
        className="px-4 py-2 text-blue-600 cursor-pointer hover:bg-gray-200"
        onClick={() => router.push("/address/add")}
      >
        Add New Address
      </div>
    </div>
  )}
</div>



          {/* Navigation Links */}
          <ul className="flex flex-row items-center gap-8 w-full justify-evenly">
            {navOptions.map((i) => (
              <li key={i.name}>
                <Link
                  className={`text-lg text-white hover:text-secondary ${pathname === i.link ? "text-secondary" : "text-white"}`}
                  href={i.link}
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Options */}
          <ul className="flex flex-row items-center gap-8">
            {isUserAuthenticated ? (
              <>
                <li>
                  <Link href="/cart">
                    <svg width="2em" height="2em" viewBox="0 0 24 24" className="bg-secondary rounded-full w-10 h-10 p-2 hover:bg-tertiary">
                      <path fill="green" d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25l.88-1.45h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21L4.27 2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"/>
                    </svg>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg text-white hover:text-secondary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/authentication?page=signin" className="text-lg text-white hover:text-secondary">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Hamburger Menu */}
        <svg width="1em" height="1em" viewBox="0 0 24 24" className="block xl:hidden text-white text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <path fill="green" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
        </svg>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="absolute top-[4em] left-0 w-full bg-primary p-6 z-50 flex flex-col items-center gap-4">
          <div className="relative w-full">
            <input
              className="w-full h-[2.5em] px-4 rounded-md border-2 border-gray-300 focus:border-blue-400 outline-none"
              type="text"
              placeholder="Search Products..."
              value={productName}
              onChange={(e) => setProductname(e.target.value)}
            />
            <button className="absolute right-0 h-[2.5em] px-2">
              {!productName.length ? (
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="green" className="text-slate-500">
                  <g>
                    <path fillRule="evenodd" d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14" />
                    <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                  </g>
                </svg>
              ) : (
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="red" className="cursor-pointer" onClick={clearSearchText}>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>

          <ul className="flex flex-col items-center gap-4 w-full">
            {navOptions.map((i) => (
              <li key={i.name}>
                <Link href={i.link} className="text-lg text-white hover:text-secondary">
                  {i.name}
                </Link>
              </li>
            ))}
            {isUserAuthenticated ? (
              <li>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-lg text-white hover:text-secondary">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link href="/authentication?page=signin" className="text-lg text-white hover:text-secondary">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {productName.length > 0 && (
        <SearchedDataListed productName={productName} setProductname={clearSearchText} />
      )}
    </nav>
  );
};

export default CommonNavBar;
