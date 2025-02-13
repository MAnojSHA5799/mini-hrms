import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Pagination, Container, Spinner, Modal, Form } from "react-bootstrap";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { format, isAfter, set } from 'date-fns';
import { useNavigate, useLocation } from "react-router-dom";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import "../../../../src/assets/css/App.css";
import { emphasize } from "@mui/material";
const columnHelper = createColumnHelper();

function LeaveRequest() {
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
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      const admin = JSON.parse(storedUser);
      setUser(admin);
      fetchUserProfiles();
    }
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateToYYYYMMDD(dateString) {
    const originalDate = new Date(dateString);
    const year = originalDate.getUTCFullYear();
    const month = String(originalDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getUTCDate()).padStart(2, '0');  // + 1
    return `${year}-${month}-${day}`;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/leaveapplications');
      const sortedData = response.data.sort((a, b) => {
        // Convert startdate strings to Date objects for comparison
        const dateA = new Date(b.applied_leave_dates);
        const dateB = new Date(a.applied_leave_dates);
        // Sort by descending order (most recent date first)
        return dateA - dateB;
      });
      console.log(sortedData)
      setUserProfiles(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      setLoading(false);
    }
  };

  // const handleApprove = async (userId, date, email,daysofleave) => {
  //   try {
  //     const formattedDate = formatDateToYYYYMMDD(date);
  //     await axios.put(`http://localhost:4000/leaveapplications/approve/${userId}`, { date: formattedDate, email: email,daysofleave:daysofleave });
  //     fetchUserProfiles();
  //     alert(`Leave application for user with Employee Code ${userId} has been approved.`);
  //   } catch (error) {
  //     console.error(`Error approving leave application with ID ${userId}:`, error);
  //   }
  // };

  // const handleReject = async (userId, date, email,daysofleave) => {
  //   try {
  //     const formattedDate = formatDateToYYYYMMDD(date);
  //     await axios.put(`http://localhost:4000/leaveapplications/reject/${userId}`, { date: formattedDate, email: email,daysofleave: daysofleave });
  //     fetchUserProfiles();
  //   } catch (error) {
  //     console.error(`Error rejecting leave application with ID ${userId}:`, error);
  //   }
  // };

  const handleApprove = async (userId, date, email, daysofleave,emp_code) => {
    const confirmApprove = window.confirm(`Are you sure you want to approve the leave application for Employee Code ${userId}?`);
    if (!confirmApprove) return;
  
    try {
      const formattedDate = formatDateToYYYYMMDD(date);
      await axios.put(`http://localhost:4000/leaveapplications/approve/${userId}`, {
        date: formattedDate,
        email: email,
        daysofleave: daysofleave,
      });
      fetchUserProfiles();
      alert(`Leave application for user with Employee Code ${userId} has been approved.`);
    } catch (error) {
      console.error(`Error approving leave application with ID ${userId}:`, error);
    }
  };
  
  const handleReject = async (userId, date, email, daysofleave) => {
    const confirmReject = window.confirm(`Are you sure you want to reject the leave application for Employee Code ${userId}?`);
    if (!confirmReject) return;
  
    try {
      const formattedDate = formatDateToYYYYMMDD(date);
      await axios.put(`http://localhost:4000/leaveapplications/reject/${userId}`, {
        date: formattedDate,
        email: email,
        daysofleave: daysofleave,
      });
      fetchUserProfiles();
      alert(`Leave application for user with Employee Code ${userId} has been rejected.`);
    } catch (error) {
      console.error(`Error rejecting leave application with ID ${userId}:`, error);
    }
  };
  

  const isStartDateInPast = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);

    // Adjust to compare only dates without time
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startWithoutTime = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    return startWithoutTime < todayWithoutTime;
};


  return (
    <>
      <Card extra={"w-full h-full sm:overflow-auto px-6"}>
        <header className="relative flex items-center justify-between pt-4">
          {/* <div className="text-xl font-bold text-navy-700 dark:text-white">User Timein Table</div> */}
          {/* <CardMenu /> */}
        </header>

        <div className="mt-0 overflow-x-scroll xl:overflow-x-scroll">
        {loading ? (
            <table striped bordered hover>
              <tbody>
                <tr>
                  <td colSpan="10">Loading...</td>
                </tr>
              </tbody>
            </table>
          ) : userProfiles.length === 0 ? (
            <table striped bordered hover>
              <tbody>
                <tr>
                  <td colSpan="10">No leave requests found.</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  {/* <th>Emp Code</th> */}
                  {/* <th>Profile</th> */}
                  <th>Name</th>
                  {/* <th>Email</th> */}
                  <th>Applied Date</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>No. of Days</th>
                  <th>Status</th>
                  {/* <th>Days Duration</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userProfiles.map(profile => (
                  <tr key={profile.id}>
                    {/* <td>{profile.emp_code}</td> */}
                    {/* <td data-label="Profile" className="text-center">
                      <div className="profile-avatar-1">
                      <img className="pro" src={profile.profile_picture} alt="Profile" />

                      </div>
                    </td> */}
                    <td data-label="Name">{profile.name}</td>
                    {/* <td>{profile.email}</td> */}
                    <td data-label="Applied Date">{formatDate(profile.applied_leave_dates)}</td>
                    <td data-label="Leave Type">{profile.leave_type}</td>
                    <td data-label="Start Date">{formatDate(profile.start_date)}</td>
                    <td data-label="End Date">{formatDate(profile.end_date)}</td>
                    <td data-label="No. of Days">{profile.days_of_leave}</td>
                    <td data-label="Status">{profile.status}</td>
                    {/* <td>{profile.leave_duration}</td> */}
                    <td data-label="Actions" className="leave-action-buttons">
  <button
    className="approve-button"
    onClick={() => handleApprove(profile.emp_code, profile.applied_leave_dates, profile.email, profile.daysofleave)}
    disabled={profile.status === 'Approved' || isStartDateInPast(profile.startdate)}
  >
    Approve
  </button>{' '}
  <button
    className="reject-button"
    onClick={() => handleReject(profile.emp_code, profile.applied_leave_dates, profile.email, profile.daysofleave)}
    disabled={profile.status === 'Rejected' || isStartDateInPast(profile.startdate)}
  >
    Reject
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      

    </>
  );
}

export default LeaveRequest;