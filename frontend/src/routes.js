import React from "react";
import MainDashboard from "views/admin/default";
import UserDashboard from "views/user/default";
import UserProfile from "views/user/profile";
import DataTables from "views/admin/tables";
import UserLeaves from "views/user/tables";
import LeaveRequest from "./views/admin/leaverequest/leaverequest";
import UserTimeIN from "../src/views/user/usertimein/usertimein";
import RTLDefault from "views/rtl/default";
import Start from "views/Hrms/start";
import EditProfile from "../src/views/admin/tables/components/EditProfile";
import SignIn from "views/auth/SignIn";
import AdminSignIn from "views/auth/AdminSignIn";
import {MdHome,MdBarChart,MdPerson,MdLock,} from "react-icons/md";
import ForgotPassword from "../src/views/auth/forgotpassword";
import TimeInDetail from "./views/admin/timeindetails/timein";
import LeaveForm from "../src/views/user/leaveform/leaveform";
import AddUser from "../src/views/admin/adduserform/adduser";
import EditLeave from "../src/views/user/tables/components/EditLeave";
import EditLeaveDetail from "../src/views/admin/leavedetails/EditLeaveDetail";

import Calendar from "../src/views/admin/calendar/BlitzCalendar";
import BlitzCalendar from "../src/views/user/calendar/BlitzCalendar";
import LeaveDetails from "views/admin/leavedetails";

const routes = [
  {
    name: "HRMS",
    layout: "/start",
    path: "blank",
    icon: <MdHome className="h-6 w-6" />,
    component: <Start />,
  },
  {
    name: "Admin Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "nft-marketplace",
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //   component: <Start />,
  //   secondary: true,
  // },
  {
    name: "All Users",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },

  {
    name: "Edit User",
    layout: "/admin",
    path: "/edit-leaves",  // Add :id to define a parameter in the path
    icon: <MdLock className="h-6 w-6" />,
    component: <EditLeaveDetail />,
},
{
  name: "Edit User",
  layout: "/admin",
  path: "/edit-profile",  // Add :id to define a parameter in the path
  icon: <MdLock className="h-6 w-6" />,
  component: <EditProfile />,
},

{
  name: "All Employee Payroll",
  layout: "/admin",
  path: "payroll",  // Add :id to define a parameter in the path
  icon: <MdLock className="h-6 w-6" />,
  component: <Calendar />,
},


  {
    name: "Leave Request",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "leave-request",
    component: <LeaveRequest />,
  },

  {
    name: "Time In Detail",
    layout: "/admin",
    path: "time-in-details",
    icon: <MdLock className="h-6 w-6" />,
    component: <TimeInDetail />,
  },

  {
    name: "Add User",
    layout: "/admin",
    path: "adduserform",
    icon: <MdLock className="h-6 w-6" />,
    component: <AddUser />,
  },

  {
    name: "Leave Details",
    layout: "/admin",
    path: "leave-details",
    icon: <MdPerson className="h-6 w-6" />,
    component: <LeaveDetails />,
  },

//credentials routes

  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Admin Sign In",
    layout: "/auth",
    path: "admin-sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <AdminSignIn/>,
  },
  {
    name: "Forgot Password",
    layout: "/auth",
    path: "forgot-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ForgotPassword/>,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },

//user routes

  {
    name: "User Dashboard",
    layout: "/user",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <UserDashboard />,
  },
  {
    name: "User Leaves",
    layout: "/user",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <UserLeaves />,
  },
  
  {
    name: "User Time In",
    layout: "/user",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "user-time-in",
    component: <UserTimeIN />,
  },
  
  {
    name: "Profile",
    layout: "/user",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <UserProfile />,
  },
  {
    name: "Leave Form Request",
    layout: "/user",
    path: "leaveform",
    icon: <MdLock className="h-6 w-6" />,
    component: <LeaveForm />,
  },
  {
    name: "User Edit Leaves",
    layout: "/user",
    path: "leave/:id",  // Add :id to define a parameter in the path
    icon: <MdLock className="h-6 w-6" />,
    component: <EditLeave />,
  },
  {
    name: "Employee Payroll",
    layout: "/user",
    path: "payroll",  // Add :id to define a parameter in the path
    icon: <MdLock className="h-6 w-6" />,
    component: <BlitzCalendar />,
  },

];
export default routes;
