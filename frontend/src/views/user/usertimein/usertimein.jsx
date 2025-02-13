import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Pagination, Container, Spinner, Modal, Form } from "react-bootstrap";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useNavigate, useLocation } from "react-router-dom";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import "../../../../src/assets/css/TimeinDetails.css";
const columnHelper = createColumnHelper();

function UserTimein() {
  const [users, setUser] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserProfiles(parsedUser.emp_code);
      fetchLeaveData(parsedUser.emp_code);
    }
  }, []);

  const fetchUserProfiles = async (employeeCode) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/usertimeinDetails/${employeeCode}`);
      // const sortedData = response.data.sort((a, b) => {
      //   const dateComparison = new Date(b.user_current_date) - new Date(a.user_current_date);
      //   return dateComparison !== 0 ? dateComparison : a.name.localeCompare(b.name);
      // });
      console.log(response.data)
      setUserProfiles(response.data);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
    setIsLoading(false);
  };

  const fetchLeaveData = async (employeeCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/leavedetails/${employeeCode}`);
      setLeaveData(response.data || []);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLeaveData([]);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options).replace(/\//g, "-");
  };

  const compareTime = (time1, time2) => {
    if (!time1 || !time2) return false;
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);
    return new Date(0, 0, 0, hours1, minutes1, seconds1) > new Date(0, 0, 0, hours2, minutes2, seconds2);
  };

  const columns = [
    columnHelper.accessor("emp_code", { header: "Emp Code", cell: info => info.row.original.emp_code }),
    columnHelper.accessor("name", { header: "Name", cell: info => info.row.original.username
    }),
    columnHelper.accessor("user_current_date", { 
      header: "Date", 
      cell: info => formatDate(info.row.original.user_current_date) 
    }),
    columnHelper.accessor("time_in", {
      header: "Time In",
      cell: info => {
        const timeIn = info.row.original.time_in ? info.row.original.time_in.slice(11, 19) : "N/A";
        return (
          <span style={{ background: compareTime(timeIn, "10:15:00") ? "#9A1B15" : "#52c41a", color: "white", padding: "3px", borderRadius: "3px" }}>
            {timeIn}
          </span>
        );
      },
    }),
    
    columnHelper.accessor("time_out", {
      header: "Time Out",
      cell: info => {
        const timeOut = info.row.original.time_out ? info.row.original.time_out.slice(11, 19) : "N/A";
        return (
          <span style={{ background: timeOut !== "N/A" && compareTime(timeOut, "18:27:00") ? "#52c41a" : "#9A1B15", color: "white", padding: "3px", borderRadius: "3px" }}>
            {timeOut}
          </span>
        );
      },
    }),
    
    // columnHelper.accessor("tea_break", {
    //   header: "Tea Break",
    //   cell: info => {
    //     const profile = info.row.original;
    //     return profile.tea_break && profile.tea_break_in ? `${profile.tea_break} to ${profile.tea_break_in}` : profile.tea_break || profile.tea_break_in || "--";
    //   },
    // }),
    // columnHelper.accessor("smoking_break", {
    //   header: "Lunch Break",
    //   cell: info => {
    //     const profile = info.row.original;
    //     return profile.smoking_break && profile.smoking_break_in ? `${profile.smoking_break} to ${profile.smoking_break_in}` : profile.smoking_break || profile.smoking_break_in || "--";
    //   },
    // }),
    columnHelper.accessor("totalMinutes", { 
      header: "Total Break Time", 
      cell: info => info.row.original.totalMinutes || "--" 
    }),
  ];

  const totalProfiles = userProfiles.length;
  const totalPages = Math.ceil(totalProfiles / itemsPerPage);
  const currentProfiles = userProfiles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <>
      <Card extra={"w-full h-full sm:overflow-auto px-6"}>
        <header className="relative flex items-center justify-between pt-4">
          {/* <div className="text-xl font-bold text-navy-700 dark:text-white">User Timein Table</div> */}
          {/* <CardMenu /> */}
        </header>

        <div className="mt-0 overflow-x-scroll xl:overflow-x-scroll">
          {isLoading ? (
            <Spinner animation="border" role="status" />
          ) : (
            <>
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.id} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentProfiles.map((profile, index) => (
                    <tr key={`${profile.emp_code}-${index}`}>
                      {columns.map((column) => (
                        <td key={column.id} className="border-b border-gray-200 px-4 py-2">
                          {flexRender(column.cell, { row: { original: profile } })}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </>
          )}
        </div>
      </Card>
      <Pagination
               style={{
            marginBottom:"5px",
            marginTop:"3%",
            colour: "white",
          }}
              >
      {Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item
          key={index + 1}
          // active={index + 1 === currentPage}
          onClick={() => setCurrentPage(index + 1)}
          // style={{
          //   backgroundImage: index + 1 === currentPage ? '-webkit-linear-gradient(270deg, #4318ff, #4318ff)' : 'none',
          //   color: index + 1 === currentPage ? '#fff' : 'inherit' // Optional: Change text color for better visibility
          // }}
        >
          {index + 1}
        </Pagination.Item>
      ))}
    </Pagination>

    </>
  );
}

export default UserTimein;