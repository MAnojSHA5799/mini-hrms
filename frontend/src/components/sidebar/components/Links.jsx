// / eslint-disable /
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon"; // Example icon import
import { MdTableView,MdAvTimer,MdHomeMax,MdVerifiedUser ,MdSupervisedUserCircle,MdRequestPage,MdCalendarMonth,MdRequestQuote,MdOutlineRequestPage} from 'react-icons/md'; // Adjust the path based on where MdTableView is located

// SidebarLinks component
export function SidebarLinks() {
  let location = useLocation();

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
 
  // JSX for dummy routes
  const createLinks = () => {
    return (
      <>
        <Link to="/admin/default">
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  activeRoute("/admin/default")
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                <MdHomeMax className="h-7 w-7" color="#E55A1B" /> 
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute("/admin/default")
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                USER DASHBOARD
              </p>
            </li>
            {activeRoute("/admin/default") ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>

        <Link to="/admin/data-tables">
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  activeRoute("/admin/data-tables")
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                <MdTableView className="h-7 w-7" color="#E55A1B" />
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute("/admin/data-tables")
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                USER LEAVES
              </p>
            </li>
            {activeRoute("/admin/data-tables") ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>

        <Link to="/admin/user-time-in">
  <div className="relative mb-3 flex hover:cursor-pointer">
    <li className="my-[3px] flex cursor-pointer items-center px-8">
      <span
        className={`${
          activeRoute("/admin/user-time-in")
            ? "font-bold text-brand-500 dark:text-white"
            : "font-medium text-gray-600"
        }`}
      >
        <MdAvTimer className="h-7 w-7" color="#E55A1B" />
      </span>
      <p
        className={`leading-1 ml-4 flex ${
          activeRoute("/admin/user-time-in")
            ? "font-bold text-navy-700 dark:text-white"
            : "font-medium text-gray-600"
        }`}
      >
        USER TIMEIN DETAILS
      </p>
    </li>
    {activeRoute("/admin/user-time-in") ? (
      <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
    ) : null}
  </div>
</Link>


        <Link to="/admin/profile">
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  activeRoute("/admin/profile")
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                <MdSupervisedUserCircle className="h-7 w-7" color="#E55A1B" />
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute("/admin/profile")
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                PROFILE
              </p>
            </li>
            {activeRoute("/admin/profile") ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>

        <Link to="/admin/leaveform">
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  activeRoute("/admin/leaveform")
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                <MdOutlineRequestPage className="h-7 w-7" color="#E55A1B" />
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute("/admin/leaveform")
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                LEAVE FORM REQUEST
              </p>
            </li>
            {activeRoute("/admin/leaveform") ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>
        <Link to="/admin/calendar">
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  activeRoute("/admin/calendar")
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                <MdCalendarMonth className="h-7 w-7" color="#E55A1B" /> 
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  activeRoute("/admin/calendar")
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                Blitz Calendar
              </p>
            </li>
            {activeRoute("/admin/calendar") ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>

      </>
    );
  };

  // BRAND
  return createLinks();
}

export default SidebarLinks;
