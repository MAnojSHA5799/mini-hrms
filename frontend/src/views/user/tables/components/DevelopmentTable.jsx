import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, Modal, Button, Form } from "react-bootstrap";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { format, isAfter, set } from 'date-fns';

const columnHelper = createColumnHelper();

function CheckTable() {
  const [users, setUser] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch leave data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      fetchLeaveData(user.emp_code);
    }
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const fetchLeaveData = async (employeeCode) => {
    try {
      const url = `http://localhost:4000/leavedetails/${employeeCode}`;
      const response = await axios.get(url);
      console.log(response.data)
      setLeaveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLoading(false);
    }
  };

  const incrementDateByOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate());   // + 1
    return date.toISOString();
  };

  const handleEdit = (leave) => {
    // Redirect to the edit page with the leave data passed as route state
    navigate(`/user/leave/${leave.id}`, { state: { leave } });
  };

  // const handleDelete = async (leave) => {
  //   console.log("del",leave)
  //   if (window.confirm('Do you want to delete this leave application?')) {
  //     try {
  //       await axios.delete(`http://localhost:4000/leavedetails/delete/${leave.id}`, { data: leave });
  //       alert('Leave detail deleted successfully');
  //       fetchLeaveData(users.emp_code);
  //     } catch (error) {
  //       console.error("Error deleting leave data:", error);
  //       alert('Failed to delete leave detail. Please try again later.');
  //     }
  //   }
  // };
  const handleDelete = async (leave) => {
    // Increment dates by one day
    const updatedLeave = {
      ...leave,
      applied_leave_dates: incrementDateByOneDay(leave.applied_leave_dates),
      enddate: incrementDateByOneDay(leave.enddate),
      startdate: incrementDateByOneDay(leave.startdate),
    };
  
    const { data, ...cleanedLeave } = updatedLeave;
    if (!window.confirm('Do you want to delete the leave application?')) {
      return;
    }
  
    try {
      const url = `http://localhost:4000/leavedetails/delete/${cleanedLeave.name}`;
      await axios.delete(url, { data: cleanedLeave });
      alert('Leave detail deleted successfully');
      fetchLeaveData(users.emp_code); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting leave data:", error);
      alert('Failed to delete leave detail. Please try again later.');
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const isStartDateInPast = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    return start <= today;
  };
 

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
      
      </header>
      <table >
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Applied Dates</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                {/* <th>Days of leave</th> */}
                <th>Status</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12">Loading...</td>
                </tr>
              ) : leaveData.length === 0 ? (
                <tr>
                  <td colSpan="12">No leave requests found.</td>
                </tr>
              ) : (
                leaveData.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.emp_code}</td>
                    <td>
                      <div className="profile-avatar">
                        {leave &&
                          leave.data &&
                          (() => {
                            const base64String = arrayBufferToBase64(
                              leave.data.data
                            );
                            return (
                              <img
                                className="pro"
                                src={`data:image/png;base64,${base64String}`}
                              />
                            );
                          })()}
                      </div>
                    </td>
                    <td>{leave.name}</td>
                    <td>{formatDate(leave.applied_leave_dates)}</td>
                    <td>{leave.leave_type}</td>
                    <td>{formatDate(leave.start_date)}</td>
                    <td>{formatDate(leave.end_date)}</td>
                    {/* <td>{leave.daysofleave}</td> */}
                    <td className="status">
                      {leave.status === "Pending" && (
                        <span className="pending">{leave.status}</span>
                      )}
                      {leave.status === "Approved" && (
                        <span className="approved">{leave.status}</span>
                      )}
                      {leave.status === "Rejected" && (
                        <span className="decline">{leave.status}</span>
                      )}
                    </td>
                    {/* <td className="leave-action-buttons">
                      <Button
                       className="approve-button"
                        variant="success"
                        onClick={() => handleEdit(leave)}
                        disabled={isStartDateInPast(leave.startdate)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="reject-button"
                        variant="danger"
                        onClick={() => handleDelete(leave)}
                        disabled={isStartDateInPast(leave.startdate)}
                      >
                        Cancel
                      </Button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
      
    </Card>
  );
}

export default CheckTable;
