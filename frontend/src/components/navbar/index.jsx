import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar10.png";

const Navbar = (props) => {
  console.log("POP",props)
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const { user } = location.state || {};
  const { admin} = location.state || {};
  console.log("User",user)
  console.log("admin",admin)
  const [storedUser, setStoredUser] = useState(null);
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  let base64String = "";
  if (storedUser && storedUser.data && storedUser.data.data) {
    base64String = arrayBufferToBase64(storedUser.data.data);
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    setStoredUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    setStoredUser(null); // Clear stored user in state
    navigate('/auth/sign-in'); // Redirect to sign-in page
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>
      <span
        className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
        onClick={onOpenSidenav}
      >
        <FiAlignJustify className="h-5 w-5" />
      </span>

      <div className="relative mt-[3px] flex h-[61px] w-[155px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[125px] xl:gap-2">
        {/* <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div> */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={base64String ? `data:image/png;base64,${base64String}` : avatar}
              alt={storedUser ? storedUser.name : "User Avatar"}
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {storedUser ? storedUser.name : 'Guest Singh'}
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
