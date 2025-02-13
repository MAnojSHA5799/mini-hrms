import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import axios from "axios";
import { FaMugHot } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import '../../../assets/css/dashboard.css';
import festivalData from '../festivalData';
const Dashboard = () => {
  const location = useLocation(); // Use useLocation hook
  const { user } = location.state || {}; // Destructure the user from state
  console.log(user)
  const [timesheetData, setTimesheetData] = useState([]);
  const [vacationLeaveData, setVacationLeaveData] = useState([]);
  const [sickLeaveData, setSickLeaveData] = useState([]);
  const [materinityLeaveData, setMaterinityLeaveData] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const [trackingData, setTrackingData] = useState([]);
  const [totalleave, setTotalLeave] = useState([]);
  const [takingLeave, setTakingLeave] = useState([]);
  const [timeCount, setTimeCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveData, setLeaveData] = useState([]);
  
  let intervalId; // Declare intervalId

  // Cleanup interval when the component is unmounted
  useEffect(() => {
    // if (user) {
    //   localStorage.setItem("user", JSON.stringify(user));
    // }
  
    // Fetch data
    fetchVacationLeaveData();
    fetchSickLeaveData();
    fetchMaterinityLeaveData();
    fetchTrackingLeaves();
    fetchTimeCount();
    fetchTimesheetAndLeaveData();
  
    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId); // Use intervalId safely
    };
  }, [user]);
  
  const fetchTimeCount = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const response = await axios.get(
        `https://mini-hrms.onrender.com/userTimeCount?employeeCode=${employeeCode}`
      );
      setTimeCount(response.data);
    } catch (error) {
      console.error("Error fetching sick leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetAndLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;

      const url = `https://mini-hrms.onrender.com/timesheet22?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`;
      const response = await axios.get(url);
      console.log("asadaddf",response.data.timeSheet)
      setTimesheetData(response.data.timeSheet);
      setLeaveData(response.data.leaves);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchVacationLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://mini-hrms.onrender.com/vacation-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setVacationLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching vacation leave data:", error);
    }
  };

  const fetchSickLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://mini-hrms.onrender.com/sick-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setSickLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching sick leave data:", error);
    }
  };

  const fetchMaterinityLeaveData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const employeeCode = JSON.parse(storedUser).emp_code;
      const employeeUsername = JSON.parse(storedUser).name;
      const response = await axios.get(
        `https://mini-hrms.onrender.com/materinity-leave?employeeCode=${employeeCode}&employeeUsername=${employeeUsername}`
      );
      setMaterinityLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching Materinity leave data:", error);
    }
  };

  const fetchTrackingLeaves = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No user found in localStorage");
      }
  
      const employeeCode = JSON.parse(storedUser).emp_code;
      const response = await axios.get(
        `https://mini-hrms.onrender.com/api/tracking-leaves?employeeCode=${employeeCode}`
      );
  
      const leaveData = response.data[0];
      
      if (leaveData) {
        setTotalLeave(leaveData.total_leaves);
        setTakingLeave(leaveData.taking_leaves); // Adjust the property names according to your data
        setTrackingData(leaveData.balance_leave); // Adjust the property names according to your data
      } else {
        console.log("No leave data found for the employee.");
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleTimeInClick = async () => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const morningLimit = 9 * 3600 + 30 * 60; // 10:15:00 in seconds
    const afternoonStart = 13 * 3600; // 13:00:00 in seconds
    const afternoonEnd = 14 * 3600 + 30 * 60; // 14:30:00 in seconds

    // Check for leave conditions
    const leave = leaveData[0];
    if (leave) {
      if (leave.leave_duration === "FirstHalf" && (currentTime < afternoonStart || currentTime > afternoonEnd)) {
        alert("For FirstHalf leave, you can Time In only between 1:00 PM to 2:30 PM.");
        return;
      } else if (leave.leave_duration === "SecondHalf" && currentTime > morningLimit) {
        alert("For SecondHalf leave, you cannot Time In after 10:15 AM.");
        return;
      }
    } else if (currentTime > morningLimit) {
      alert("The current time is after 09:30:00. You cannot Time In.");
      return;
    }
    const confirmation = window.confirm("Are you sure you want to Time In?");
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");
        const employeeCode = JSON.parse(storedUser).emp_code;
        const employeeUsername = JSON.parse(storedUser).name;
        const url = `https://mini-hrms.onrender.com/timein`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };
        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {        
        console.error("Error:", error);
      }
    }
  };
 
  const handleTimeOutClick = async () => {
    const now = new Date();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const targetTime = 18 * 3600 + 20 * 60; // 9:45:00 in seconds
    if (currentTime <= targetTime) {
      alert("The current time is before 06:20:00. You cannot Time Out.");
      return;
    }
    const confirmation = window.confirm("Are you sure you want to Time out?");
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/timeout`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInOneClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-1 time in?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakIn`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutOneClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-1 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakOut`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInTwoClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-2  Time In  ?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakInTwo`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutTwoClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-2 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakOutTwo`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakInThreeClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-3 Time In ?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakInThree`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleTeaBreakOutThreeClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Tea Break-3 Time Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/teabreakOutThree`;

        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleSmokingBreakClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Lunch Break Out?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/smokingbreak`;

        // Prepare data to send to the backend
        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

  const handleSmokingBreakInClick = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to Lunch Break In?"
    );
    if (confirmation) {
      try {
        const storedUser = localStorage.getItem("user");

        const employeeCode = JSON.parse(storedUser).emp_code;

        const employeeUsername = JSON.parse(storedUser).name;

        const url = `https://mini-hrms.onrender.com/smokingbreakIn`;

        // Prepare data to send to the backend
        const requestData = {
          employeeCode: employeeCode,
          employeeUsername: employeeUsername,
        };

        const response = await axios.post(url, requestData);
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      // Handle "No" option or do nothing
      // You can add your logic here for "No" option or just leave it blank if no action required
    }
  };

   const currentDate = new Date();
 const currentMonth = currentDate.toLocaleString("default", { month: "short" });

 const filteredFestivals = festivalData.filter(
   (festival) => festival.id === currentMonth
 );
  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">  
      <Widget
          icon={<MdBarChart className="h-7 w-7" color='#ff5722' />}
          title={"Total Leave"}
          subtitle={totalleave}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" color='#ff5722' />}
          title={"Leaves Taken"}
          subtitle={takingLeave}
        />
        <Widget 
          icon={<MdDashboard className="h-6 w-6" color='#ff5722' />}
          title={"Balance Leave"}
          subtitle={trackingData}
        />
      </div>

      

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
        <Container className="timesheet-container p-0">
          <Row>
            <Col className="text-left">
              <h3 className="timesheet-title">Timesheet</h3>
            </Col>
          </Row>
          <Row className="justify-content-between align-items-left mb-3">
  <Col md={3} xs={6}>
    {/* Time In Button Logic */}
    {
      timesheetData.length === 0 ? (
        <div>
          <Button className="btn1" onClick={handleTimeInClick}>
            Time In
          </Button>
        </div>
      ) : (
        timesheetData.map((item, index) => {
          // Function to format the date to "YYYY-MM-DD"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          };

          const formattedUserCurrentDate = formatDate(item.user_current_date);

          return (
            <React.Fragment key={index}>
              {formattedUserCurrentDate === todayDate ? (
                <Button
                  className="btn2"
                  onClick={handleTimeInClick}
                  disabled // Add disabled attribute to disable the icon
                >
                  Time In
                </Button>
              ) : (
                <Button className="btn1" onClick={handleTimeInClick}>
                  Time In
                </Button>
              )}
            </React.Fragment>
          );
        })
      )
    }

    {/* Time Out Button Logic */}
    {
      timesheetData.length === 0 ? (
        <div>
          <Button className="btn1" onClick={handleTimeOutClick}>
            Time Out
          </Button>
        </div>
      ) : (
        timesheetData.map((item, index) => {
          // Function to format the date to "YYYY-MM-DD"
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
          };

          const formattedUserCurrentDate = formatDate(item.user_current_date);

          return (
            <React.Fragment key={index}>
              {formattedUserCurrentDate === todayDate && item.time_out != null ? (
                <Button
                  className="btn2"
                  onClick={handleTimeOutClick}
                  disabled // Add disabled attribute to disable the icon
                >
                  Time Out
                </Button>
              ) : (
                <Button className="btn1" onClick={handleTimeOutClick}>
                  Time Out
                </Button>
              )}
            </React.Fragment>
          );
        })
      )
    }
  </Col>
</Row>

        </Container>

        <Container className="timesheet-container p-5">
          <Row>
            <Col md={6} className="text-center">
              <h5 className="timesheet-subtitle">View timesheet</h5>
              {
  timesheetData.length === 0 ? (
    <p>No timesheet data available.</p>
  ) : (
    timesheetData.map((index) => (
      <div key={index}>
        <strong style={{ fontWeight: "600", color: "#230B54" }}>
          Time in:
        </strong>{" "}
        {index.time_in}
        <br />
        <strong style={{ fontWeight: "600", color: "#230B54" }}>
          Time out:
        </strong>{" "}
        {index.time_out}
      </div>
    ))
  )
}
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Container className="timesheet-container p-0">
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">  
      <Row>
        
        <Col md={6}><h3 className="timesheet-title">Break Timesheet</h3></Col>
        </Row>
        <Row>
        
        
        </Row>
        <Row>
        
        {timeCount.length > 0 ? (
                        <>
                          <strong
                            style={{
                              fontWeight: "600",
                              color: "#230B54",
                            }}
                          >
                            Total Minutes
                          </strong>{" "}
                          : 60
                          <br />
                          <strong
                            style={{
                              fontWeight: "600",
                              color: "#230B54",
                            }}
                          >
                            Remaining Minutes
                          </strong>{" "}
                          : {timeCount[0].remaining_minutes}
                          <br />
                          <strong
                            style={{
                              fontWeight: "600",
                              color: "#230B54",
                            }}
                          >
                            Taking Time
                          </strong>{" "}
                          : {timeCount[0].total_minutes}:
                          {timeCount[0].total_seconds}
                        </>
                      ) : (
                        <div>
                          <>
                            <strong
                              style={{
                                fontWeight: "600",
                                color: "#230B54",
                              }}
                            >
                              Total Minutes
                            </strong>{" "}
                            : 60
                            <br />
                            <strong
                              style={{
                                fontWeight: "600",
                                color: "#230B54",
                              }}
                            >
                              Remaining Minutes
                            </strong>{" "}
                            : No breaking time.
                            <br />
                            <strong
                              style={{
                                fontWeight: "600",
                                color: "#230B54",
                              }}
                            >
                              Taking Time
                            </strong>{" "}
                            : No breaking time.
                          </>
                        </div>
                      )}
        </Row>
      </div>
        
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">  
      <Row>
          <Col md={3}>
          <h3 className="text-left" style={{ fontWeight: 'bold', padding: '1px', marginBottom: '10px' }}>
          Tea Break</h3>
            <div className="button-group">
            {timesheetData.length === 0 ? (
                            <>
                              <Button
                                className="btn-disable"
                                onClick={handleTeaBreakOutOneClick}
                              >
                                Time Start
                              </Button>
                              <FaMugHot className="tea-icon" />
                              <Button
                                className="btn-disable"
                                onClick={handleTeaBreakInOneClick}
                              >
                                Time End
                              </Button>
                            </>
                          ) : (
                            timesheetData.map((item, index) => {
                              const formatDate = (dateString) => {
                                const date = new Date(dateString);
                                return `${date.getFullYear()}-${(
                                  date.getMonth() + 1
                                )
                                  .toString()
                                  .padStart(2, "0")}-${date
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}`;
                              };

                              const formattedUserCurrentDate = formatDate(
                                item.user_current_date
                              );

                              return (
                                <React.Fragment key={index}>
                                  {formattedUserCurrentDate === todayDate &&
                                  item.tea_break === null &&
                                  item.tea_break_in === null ? (
                                    <>
                                      <Button
                                        className="btn-enable"
                                        onClick={handleTeaBreakOutOneClick}
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        className="btn-disable"
                                        onClick={handleTeaBreakInOneClick}
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : item.tea_break != "" &&
                                    item.tea_break_in === null ? (
                                    <>
                                      <Button
                                        onClick={handleTeaBreakOutOneClick}
                                        className="btn-disable"
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        onClick={handleTeaBreakInOneClick}
                                        className="btn-enable"
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : item.tea_break_in != "" &&
                                    item.tea_break != "" ? (
                                    <>
                                      <Button
                                        onClick={handleTeaBreakOutOneClick}
                                        className="btn-disable"
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        onClick={handleTeaBreakInOneClick}
                                        className="btn-disable"
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : //    timesheetData[0].time_out !== ''? (
                                  //   <>
                                  //     <Button
                                  //       onClick={handleTeaBreakOutOneClick}
                                  //       className="btn-disable"
                                  //     >
                                  //       Time Out
                                  //     </Button>
                                  //     <FaMugHot className="tea-icon" />
                                  //     <Button
                                  //       onClick={handleTeaBreakInOneClick}
                                  //       className="btn-disable"
                                  //     >
                                  //       Time In
                                  //     </Button>
                                  //   </>
                                  // ) :
                                  null}
                                </React.Fragment>
                              );
                            })
                          )}
            </div>
            <div className="button-group">
            {timesheetData.length === 0 ? (
                            <>
                              <Button
                                onClick={handleTeaBreakOutTwoClick}
                                className="btn-disable"
                              >
                                Time Start
                              </Button>
                              <FaMugHot className="tea-icon" />
                              <Button
                                onClick={handleTeaBreakInTwoClick}
                                className="btn-disable"
                              >
                                Time End
                              </Button>
                            </>
                          ) : (
                            timesheetData.map((item, index) => {
                              const formatDate = (dateString) => {
                                const date = new Date(dateString);
                                return `${date.getFullYear()}-${(
                                  date.getMonth() + 1
                                )
                                  .toString()
                                  .padStart(2, "0")}-${date
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}`;
                              };

                              const formattedUserCurrentDate = formatDate(
                                item.user_current_date
                              );

                              return (
                                <React.Fragment key={index}>
                                  {formattedUserCurrentDate === todayDate &&
                                  item.tea_break_two === null &&
                                  item.tea_break_two_in === null ? (
                                    <>
                                      <Button
                                        onClick={handleTeaBreakOutTwoClick}
                                        className="btn-enable"
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        onClick={handleTeaBreakInTwoClick}
                                        className="btn-disable"
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : item.tea_break_two != "" &&
                                    item.tea_break_two_in === null ? (
                                    <>
                                      <Button
                                        onClick={handleTeaBreakOutTwoClick}
                                        className="btn-disable"
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        onClick={handleTeaBreakInTwoClick}
                                        className="btn-enable"
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : item.tea_break_two_in != "" &&
                                    item.tea_break_two != "" ? (
                                    <>
                                      <Button
                                        onClick={handleTeaBreakOutTwoClick}
                                        className="btn-disable"
                                      >
                                        Time Start
                                      </Button>
                                      <FaMugHot className="tea-icon" />
                                      <Button
                                        onClick={handleTeaBreakInTwoClick}
                                        className="btn-disable"
                                      >
                                        Time End
                                      </Button>
                                    </>
                                  ) : null}
                                </React.Fragment>
                              );
                            })
                          )}
            </div>
          </Col>
          <Col md={6}>
          
          </Col>
        </Row>
        <Row>
          <Col md={3}>
          <h3 className="text-left" style={{ fontWeight: 'bold', padding: '1px', marginBottom: '10px' }}>
  Lunch Break
</h3>
            <div className="button-group">
            {timesheetData.length === 0 ? (
                            <div>
                              <Button
                                onClick={handleSmokingBreakClick}
                                className="btn-Lunch-disable"
                              >
                                Lunch Start
                              </Button>
                              <FaUtensils  className="Lunch-icon" /> 
                              <Button
                                onClick={handleSmokingBreakInClick}
                                className="btn-Lunch-disable"
                              >
                                Lunch End
                              </Button>
                            </div>
                          ) : (
                            timesheetData.map((item, index) => {
                              const formatDate = (dateString) => {
                                const date = new Date(dateString);
                                return `${date.getFullYear()}-${(
                                  date.getMonth() + 1
                                )
                                  .toString()
                                  .padStart(2, "0")}-${date
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}`;
                              };

                              const formattedUserCurrentDate = formatDate(
                                item.user_current_date
                              );

                              return (
                                <React.Fragment key={index}>
                                  {formattedUserCurrentDate === todayDate &&
                                  item.smoking_break === null &&
                                  item.smoking_break_in === null ? (
                                    <>
                                      <Button
                                        onClick={handleSmokingBreakClick}
                                        className="btn-Lunch-enable"
                                      >
                                        Lunch Start
                                      </Button>
                                      <FaUtensils  className="Lunch-icon" /> 
                                      <Button
                                        onClick={handleSmokingBreakInClick}
                                        className="btn-Lunch-disable"
                                      >
                                        Lunch End
                                      </Button>
                                    </>
                                  ) : item.smoking_break != "" &&
                                    item.smoking_break_in === null ? (
                                    <>
                                      <Button
                                        onClick={handleSmokingBreakClick}
                                        className="btn-Lunch-disable"
                                      >
                                        Lunch Start
                                      </Button>
                                      <FaUtensils  className="Lunch-icon" /> 
                                      <Button
                                        onClick={handleSmokingBreakInClick}
                                        className="btn-Lunch-enable"
                                      >
                                        Lunch End
                                      </Button>
                                    </>
                                  ) : item.smoking_break_in != "" &&
                                    item.smoking_break != "" ? (
                                    <>
                                      <Button
                                        onClick={handleSmokingBreakClick}
                                        className="btn-Lunch-disable"
                                      >
                                        Lunch Start
                                      </Button>
                                      <FaUtensils  className="Lunch-icon" /> 
                                      <Button
                                        onClick={handleSmokingBreakInClick}
                                        className="btn-Lunch-disable"
                                      >
                                        Lunch End
                                      </Button>
                                    </>
                                  ) : null}
                                </React.Fragment>
                              );
                            })
                          )}
            </div>
           
          </Col>
          <Col md={6}>
          
          </Col>
        </Row>
        <Row>
          <Col md={3}>
        <div className="view-timesheet">
            <h5 className="timesheet-subtitle">View timesheet</h5>
            {timesheetData.map((index) => (
                            <div key={index}>
                              {index.tea_break && index.tea_break_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-1 :
                                  </strong>{" "}
                                  {index.tea_break} to {index.tea_break_in}
                                </>
                              ) : index.tea_break ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-1 :
                                  </strong>{" "}
                                  {index.tea_break}
                                </>
                              ) : index.tea_break_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-1 :
                                  </strong>{" "}
                                  to {index.tea_break_in}
                                </>
                              ) : null}

                              <br />
                              {index.tea_break_two && index.tea_break_two_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-2 :
                                  </strong>{" "}
                                  {index.tea_break_two} to{" "}
                                  {index.tea_break_two_in}
                                </>
                              ) : index.tea_break_two ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-2 :
                                  </strong>{" "}
                                  {index.tea_break_two}
                                </>
                              ) : index.tea_break_two_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Tea Break-2 :
                                  </strong>{" "}
                                  to {index.tea_break_two_in}
                                </>
                              ) : null}

                              <br />
                              {index.smoking_break && index.smoking_break_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Lunch Break :
                                  </strong>{" "}
                                  {index.smoking_break} to{" "}
                                  {index.smoking_break_in}
                                </>
                              ) : index.smoking_break ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Lunch Break :
                                  </strong>{" "}
                                  {index.smoking_break}
                                </>
                              ) : index.smoking_break_in ? (
                                <>
                                  <strong
                                    style={{
                                      fontWeight: "600",
                                      color: "#230B54",
                                    }}
                                  >
                                    Lunch Break :
                                  </strong>{" "}
                                  to {index.smoking_break_in}
                                </>
                              ) : null}
                            </div>
                          ))}
          </div>
          </Col>
          </Row>
      </div>
      </Container> */}

      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-3 xl:grid-cols-3">
        <div className="grid grid-cols-1 rounded-[20px]">
          <MiniCalendar />
        </div>
        <div className="grid grid-cols-1 rounded-[20px]">
        <Widget
  title="Holiday"
  subtitle={
    <div>
      {filteredFestivals.map((festival, index) => (
        <div key={index} style={{ color: '#2d2d2d', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          {festival.name} - {festival.date}
        </div>
      ))}
    </div>
  }
/>


</div>


      </div>
    </div>
  );
};

export default Dashboard;
