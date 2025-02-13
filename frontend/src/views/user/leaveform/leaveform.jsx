import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import festivaldata from "../festivalData";

function LeaveForm() {
  const [festivalData] = useState(festivaldata);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();
  const [applyDate, setApplyDate] = useState([]);
  const [users, setUsers] = useState(null);
  const [empCode, setEmpCode] = useState();
  const [loading, setLoading] = useState(true);
  const [depart, setDepart] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [leaveDuration, setLeaveDuration] = useState("full");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("store",parsedUser)
      setUsers(parsedUser);
      setEmpCode(parsedUser.emp_code);
      setEmail(parsedUser.email);
      setDepart(parsedUser.department);

      fetchLeaveData(parsedUser.emp_code);
    }
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const todayDate = getCurrentDate();

  const fetchLeaveData = async (employeeCode) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://mini-hrms.onrender.com/leavedetails/${employeeCode}`
      );
      const leaveDates = response.data.map((leave) =>
        new Date(leave.applied_leave_dates).toISOString().slice(0, 10)
      );
      console.log("54",leaveDates)
      setApplyDate(leaveDates);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isFestival = (date) => {
    const formattedDate = date.toISOString().slice(0, 10);
    return festivalData.some((festival) => festival.date === formattedDate);
  };

  const countWeekdays = (start, end) => {
    let count = 0;
    let current = new Date(start);

    while (current <= end) {
      if (!isWeekend(current) && !isFestival(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (!startDate || !endDate) {
      alert("Please provide valid start and end dates.");
      setLoadingSubmit(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("Start date cannot be after the end date.");
      setLoadingSubmit(false);
      return;
    }

    if (leaveDuration !== "full" && startDate !== endDate) {
      alert("For a half-day leave, start and end dates must be the same.");
      setLoadingSubmit(false);
      return;
    }

    const daysOfLeave =
      leaveDuration === "full" ? countWeekdays(start, end) : 0.5;

    if (daysOfLeave <= 0) {
      alert("Selected dates do not include any valid leave days.");
      setLoadingSubmit(false);
      return;
    }

    const leaveRequest = {
      name: users ? users.name : "",
      leaveType,
      empCode,
      startDate,
      endDate,
      daysOfLeave,
      reason,
      email,
      status: "Pending",
      total_leave: 18,
      depart,
      leaveDuration,
    };

    try {
      await axios.post("https://mini-hrms.onrender.com/leave-applications", leaveRequest);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/user/data-tables");
      }, 3000);
    } catch (error) {
      console.error("Error submitting leave application:", error);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
        <h2>Leave Form Request</h2>
         {/* {loading ? (
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "20px auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "720px",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : applyDate.includes(todayDate) ? (
          <Alert
            variant="danger"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "20px auto",
              border: "2px solid white",
              height: "130px",
            }}
          >
            You can apply for leave only once in one day.
          </Alert>
        ) : (  */}
          <form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label style={{ fontWeight: "bold" }}>Name:</Form.Label>
              <Form.Control
                type="text"
                value={users ? users.name : ""}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="leaveType">
              <Form.Label style={{ fontWeight: "bold" }}>Leave Type:</Form.Label>
              <br />
              <Form.Select
                style={{ fontWeight: "/", width: "100%", height: "35px" }}
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Please select leave type</option>
                <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                <option value="Earned Leave">Earned Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="leaveDuration">
              <Form.Label style={{ fontWeight: "bold" }}>Leave Duration:</Form.Label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Check
                  type="checkbox"
                  label="Full Day"
                  name="leaveDuration"
                  value="full"
                  checked={leaveDuration.includes("full")}
                  onChange={() =>
                    setLeaveDuration((prev) =>
                      prev.includes("full") ? prev.filter((d) => d !== "full") : [...prev, "full"]
                    )
                  }
                  style={{ marginRight: "10px" }}
                />
                <Form.Check
                  type="checkbox"
                  label="First Half"
                  name="leaveDuration"
                  value="firstHalf"
                  checked={leaveDuration.includes("firstHalf")}
                  onChange={() =>
                    setLeaveDuration((prev) =>
                      prev.includes("firstHalf") ? prev.filter((d) => d !== "firstHalf") : [...prev, "firstHalf"]
                    )
                  }
                  style={{ marginRight: "10px" }}
                />
                <Form.Check
                  type="checkbox"
                  label="Second Half"
                  name="leaveDuration"
                  value="secondHalf"
                  checked={leaveDuration.includes("secondHalf")}
                  onChange={() =>
                    setLeaveDuration((prev) =>
                      prev.includes("secondHalf") ? prev.filter((d) => d !== "secondHalf") : [...prev, "secondHalf"]
                    )
                  }
                />
              </div>
            </Form.Group>

            <Form.Group controlId="empCode">
              <Form.Label style={{ fontWeight: "bold" }}>Emp Code:</Form.Label>
              <Form.Control type="text" value={empCode} readOnly />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label style={{ fontWeight: "bold" }}>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="depart">
              <Form.Label style={{ fontWeight: "bold" }}>Department:</Form.Label>
              <Form.Control type="text" value={depart} readOnly />
            </Form.Group>

            <Form.Group controlId="startDate">
              <Form.Label style={{ fontWeight: "bold" }}>Start Date:</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={todayDate}
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.Label style={{ fontWeight: "bold" }}>End Date:</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate ? startDate : todayDate}
              />
            </Form.Group>

            <Form.Group controlId="reason">
              <Form.Label style={{ fontWeight: "bold" }}>Reason:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? <Spinner as="span" animation="border" size="sm" /> : "Submit"}
            </Button>
          </form>
        {/* )} */}
        {showAlert && <Alert variant="success">Leave application submitted successfully!</Alert>}
        {showErrorAlert && <Alert variant="danger">Error submitting leave application. Please try again.</Alert>}
      </div>
    </div>
  );
}

export default LeaveForm;