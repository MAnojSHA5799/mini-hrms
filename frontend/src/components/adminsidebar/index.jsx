import { useEffect, useState } from 'react';
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import { useLocation } from 'react-router-dom'; // Import useLocation
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  const [storedUser, setStoredUser] = useState(null);
  const location = useLocation(); // Use useLocation hook
  const { admin } = location.state || {}; // Destructure the user from state
 console.log("storedUser",storedUser,admin)
  useEffect(() => {
    // Retrieve the user data from localStorage or sessionStorage when the component mounts
    const admin = JSON.parse(localStorage.getItem('admin')) || null; 
    // Alternatively, use sessionStorage
    // const user = JSON.parse(sessionStorage.getItem('user')) || null;
    setStoredUser(admin);
  }, []); // Empty dependency array ensures this runs only once when the component mounts
  
 
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[86px] mt-[30px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[25px] font-bold uppercase text-navy-700 dark:text-white">
        {storedUser ? storedUser.username : 'Guest'} 
        </div>
      </div>
      <div class="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      <div className="flex justify-left ">
        <SidebarCard />
      </div>

    </div>
  );
};

export default Sidebar;

