import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation
import MiniCalendar from "components/calendar/MiniCalendar";
import { IoDocuments } from "react-icons/io5";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  MdBarChart,
  MdDashboard,
  MdOutlineHolidayVillage,
} from "react-icons/md";
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import { Button, Container, Row, Col } from "react-bootstrap";
import Widget from "components/widget/Widget";
import { flexRender } from "react-table";
import "../../../assets/css/dashboard.css";
import "../../../assets/css/App.css";

import festivalData from "../festivalData";
const Dashboard = () => {
  const location = useLocation(); // Use useLocation hook
  const { admin } = location.state || {}; // Destructure the user from state
  const percentage = 66;
  const date = new Date();
  const [leaveData, setLeaveData] = useState([]);

  const [approvedData, setApprovedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const currentMonth1 = new Date().getMonth(); // e.g., 8 for September
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth1);

  const [rejectedData, setRejectedData] = useState([]);
  const [filterRectedData, setFilterRectedData] = useState([]);
  const currentMonthRectedData = new Date().getMonth(); // e.g., 8 for September
  const currentYearRectedData = new Date().getFullYear();
  const [selectedMonthRectedData, setSelectedMonthRectedData] = useState(
    currentMonthRectedData
  );

  const [trackingData, setTrackingData] = useState([]);
  const [filterTrackingData, setFilterTrackingData] = useState([]);
  const currentMonthTrackingData = new Date().getMonth(); // e.g., 8 for September
  const currentYearTrackingData = new Date().getFullYear();
  const [selectedMonthTrackingData, setSelectedMonthTrackingData] = useState(
    currentMonthTrackingData
  );

  const [averageTimeIn, setAverageTimeIn] = useState("");
  const [averageWorkTime, setAverageWorkTime] = useState("");
  const [averageTimeOut, setAverageTimeOut] = useState("");
  let intervalId; 
  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    }
    fetchLeaveData();
    fetchApprovedData();
    fetchRejectedData();
    fetchTrackingLeaves();
    fetchAverageTimeIn();
    fetchAverageWorkTime();
    fetchAverageTimeOut();
    return () => {
      if (intervalId) clearInterval(intervalId); // Use intervalId safely
    };
  }, [admin]);
  useEffect(() => {
    filterByMonth(currentMonth1);
    // filterByMonth(currentMonthRectedData);
  }, [approvedData]);
  useEffect(() => {
    filterByMonthReject(currentMonthRectedData);
  }, [rejectedData]);
  useEffect(() => {
    filterByMonthTracking(currentMonthTrackingData);
  }, [trackingData]);

  const fetchTrackingLeaves = async () => {
    try {
      const response = await axios.get(
        "https://mini-hrms.onrender.com/api/tracking-leaves1"
      );
      setTrackingData(response.data);
      setFilterTrackingData(response.data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleMonthChangeTracking = (e) => {
    const month = parseInt(e.target.value); // Ensure value is a number
    setSelectedMonthTrackingData(month);
    filterByMonthTracking(month);
  };

  // Filter data based on the selected month
  const filterByMonthTracking = (month) => {
    if (month === "") {
      setFilterTrackingData(trackingData); // Show all data if no month is selected
    } else {
      const filtered = trackingData.filter((leave) => {
        const leaveDate = new Date(leave.applied_leave_dates);
        return leaveDate.getMonth() === month; // Compare month
      });
      setFilterTrackingData(filtered);
    }
  };

  const fetchRejectedData = async () => {
    try {
      const response = await axios.get(
        "https://mini-hrms.onrender.com/api/Rejected-data"
      );
      setRejectedData(response.data);
      setFilterRectedData(response.data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleMonthChangeReject = (e) => {
    const month = parseInt(e.target.value); // Ensure value is a number
    setSelectedMonthRectedData(month);
    filterByMonthReject(month);
  };

  // Filter data based on the selected month
  const filterByMonthReject = (month) => {
    if (month === "") {
      setFilterRectedData(rejectedData); // Show all data if no month is selected
    } else {
      const filtered = rejectedData.filter((leave) => {
        const leaveDate = new Date(leave.applied_leave_dates);
        return leaveDate.getMonth() === month; // Compare month
      });
      setFilterRectedData(filtered);
    }
  };

  const fetchApprovedData = async () => {
    try {
      const response = await axios.get(
        "https://mini-hrms.onrender.com/api/approved-data"
      );
      setApprovedData(response.data);
      setFilteredData(response.data); // Initially set filtered data to all approved data
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  // Handle month selection
  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value); // Ensure value is a number
    setSelectedMonth(month);
    filterByMonth(month);
  };

  // Filter data based on the selected month
  const filterByMonth = (month) => {
    if (month === "") {
      setFilteredData(approvedData); // Show all data if no month is selected
    } else {
      const filtered = approvedData.filter((leave) => {
        const leaveDate = new Date(leave.applied_leave_dates);
        return leaveDate.getMonth() === month; // Compare month
      });
      setFilteredData(filtered);
    }
  };

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  const fetchAverageTimeIn = async () => {
    try {
      // Replace 'https://mini-hrms.onrender.com' with your actual backend URL
      const response = await axios.get(
        "https://mini-hrms.onrender.com/getAverageTimeIn"
      );
      const data = response.data;

      // Assuming your backend response is { average_time_in: 'HH:MI AM/PM' }
      setAverageTimeIn(data.average_time_in);
    } catch (error) {
      console.error("Error fetching average time in:", error);
      // Handle error state if needed
    }
  };

  const fetchAverageWorkTime = async () => {
    try {
      const response = await axios.get(
        "https://mini-hrms.onrender.com/getAverageWorkTime"
      );
      const data = response.data;

      // Assuming your backend response is { overallAverageWorkTime: '5h 45m' }
      setAverageWorkTime(data.overallAverageWorkTime);
    } catch (error) {
      console.error("Error fetching average work time:", error);
      // Handle error state if needed
    }
  };

  const fetchAverageTimeOut = async () => {
    try {
      const response = await axios.get(
        "https://mini-hrms.onrender.com/getAverageTimeOut"
      );
      const data = response.data;

      // Assuming your backend response is { average_time_out: '6:30 PM' }
      setAverageTimeOut(data.average_time_out);
    } catch (error) {
      console.error("Error fetching average time out:", error);
      // Handle error state if needed
    }
  };

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get("https://mini-hrms.onrender.com/api/leave-data");
      setLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  // Helper function to format date (e.g., "2023-09-01")

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // Get the current month and day
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "short",
  });

  const filteredFestivals = festivalData.filter(
    (festival) => festival.id === currentMonth
  );
  return (
    <div>
      {/* <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
        <Widget
          icon={<MdBarChart className="h-7 w-7" color="#ff5722" />}
          title={"Average in time of team"}
          subtitle={averageTimeIn}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" color="#ff5722" />}
          title={"Team Average work time"}
          subtitle={averageWorkTime}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" color="#ff5722" />}
          title={"Average out time of teams"}
          subtitle={averageTimeOut}
        />
      </div> */}

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
        <Container className="timesheet-container p-0">
          <Row>
            <Col className="text-center">
              <h3 className="timesheet-title">Approved Leaves</h3>
              <div className="filter-container">
                <label htmlFor="monthFilter">Filter by Month:</label>
                <select
                  id="monthFilter"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="">All</option>
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>

              {filteredData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Emp Code</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((leave) => (
                      <tr key={leave.id}>
                        <td data-label="Emp Code">{leave.emp_code}</td>
                        <td data-label="Name">{leave.name}</td>
                        <td data-label="Status" className="status">
                          <span className="approved">{leave.status}</span>
                        </td>
                        <td data-label="Applied Date">
                          {formatDate(leave.applied_leave_dates)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No leaves taken in this month.</p>
              )}
            </Col>
          </Row>
        </Container>

        <Container className="timesheet-container p-5">
          <Row>
            <Col md={6} className="text-center">
              <h5 className="timesheet-title">Declined Leaves</h5>
              <div className="filter-container">
                <label htmlFor="monthFilter">Filter by Month:</label>
                <select
                  id="monthFilter"
                  value={selectedMonthRectedData}
                  onChange={handleMonthChangeReject}
                >
                  <option value="">All</option>
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>

              {filterRectedData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Emp Code</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRectedData.map((leave) => (
                      <tr key={leave.id}>
                        <td data-label="Emp Code">{leave.emp_code}</td>
                        <td data-label="Name">{leave.name}</td>
                        <td data-label="Status" className="status">
                          <span className="decline">{leave.status}</span>
                        </td>
                        <td data-label="Applied Date">
                          {formatDate(leave.applied_leave_dates)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No leaves rejected in this month.</p>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-1 xl:grid-cols-1">
        <Container className="timesheet-container p-0">
          <Row>
            <Col className="text-center">
              <h3 className="timesheet-title">Pending Leaves</h3>
              <table>
                <thead>
                  <tr>
                    <th>Emp Code</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map((leave) => (
                    <tr key={leave.id}>
                      <td data-label="Emp Code">{leave.emp_code}</td>
                      <td data-label="Name">{leave.name}</td>
                      <td data-label="Status" class="status">
                        <span class={leave.status.toLowerCase()}>
                          {leave.status}
                        </span>
                      </td>
                      <td data-label="Applied Date">
                        {formatDate(leave.applied_leave_dates)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </div>

      {/*  */}

      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-3 xl:grid-cols-3">
        <div className="grid grid-cols-1 rounded-[20px]">
          <MiniCalendar />
        </div>
        {/* <div className="grid grid-cols-1 rounded-[20px]">
          <Widget
            icon={<MdOutlineHolidayVillage className="h-5 w-5" color='#ff5722' />}
            title="Holiday"
            subtitle={
              <div>
                {filteredFestivals.map((festival, index) => (
                  <div
                    key={index}
                    style={{
                      color: "#2d2d2d",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}
                  >
                    {festival.name} - {festival.date}
                  </div>
                ))}
              </div>
            }
          />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
