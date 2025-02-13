import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function EditLeave() {
  const location = useLocation();
  const navigate = useNavigate();
  const { leave } = location.state; // Get the leave data from the state
  console.log(leave);

  const [leaveType, setLeaveType] = useState(leave.leavetype);
  const [currentLeave, setCurrentLeave] = useState({
    id: leave.id,
    name: leave.name,
    startdate: leave.startdate,
    enddate: leave.enddate,
    daysofleave: leave.daysofleave,
    status: leave.status,
    applied_leave_dates: leave.applied_leave_dates,
    emp_code: leave.emp_code,
    total_leaves: leave.total_leaves,
    email: leave.email,
  });
  const [reason, setReason] = useState(leave.reason);
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  const handleEdit = (leave) => {
    setCurrentLeave(leave);
    setLeaveType(leave.leavetype);
    setReason(leave.reason); // Step 2: Set reason from leave
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLeave({ ...currentLeave, [name]: value });
    if (name === 'reason') {
      setReason(value); // Update reason state
    }
  };

  const handleSaveChanges = async () => {
    // const updatedDate = new Date(currentLeave.applied_leave_dates);
    // const formattedDate = updatedDate.toISOString();

    const updatedDate = new Date(currentLeave.applied_leave_dates);
    updatedDate.setDate(updatedDate.getDate()); // Increment the date by 1 day
    const formattedDate = updatedDate.toISOString();
    const updatedLeaveData = {
      name: currentLeave.name,
      leavetype: leaveType,
      startdate: currentLeave.startdate,
      enddate: currentLeave.enddate,
      daysofleave: currentLeave.daysofleave,
      reason: reason, // Use reason state
      status: currentLeave.status,
      applied_leave_dates: formattedDate, // Use the modified date
      emp_code: currentLeave.emp_code,
      total_leaves: currentLeave.total_leaves,
      email: currentLeave.email,
    };

    console.log("61",updatedLeaveData)

    try {
      // Perform the PUT request with updatedLeaveData
      await axios.put(`http://localhost:4000/leavedetails/${currentLeave.id}`, updatedLeaveData);

      // Close modal after successful update
      setShowModal(false);

      // Refresh data after update (add fetchLeaveData function if required)
      // fetchLeaveData(currentLeave.emp_code);

      alert('Leave details updated successfully');
      navigate('/user/data-tables'); // Redirect to leave table
    } catch (error) {
      console.error("Error updating leave data:", error);
      alert('Failed to update leave details. Please try again later.');
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
        <h2>Edit User Leave</h2>
        <Form>
          <Form.Group controlId="leaveType">
            <Form.Label>Leave Type:</Form.Label>
            <Form.Select
              style={{ fontWeight: "/", width: "100%", height: "35px" }}
              value={leaveType}
              name="leavetype"
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="Vacation Leave">Vacation Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
              <option value="Study Leave">Study Leave</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startdate"
              value={currentLeave.startdate}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="enddate"
              value={currentLeave.enddate}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formDaysOfLeave">
            <Form.Label>Days of Leave</Form.Label>
            <Form.Control
              type="number"
              name="daysofleave"
              value={currentLeave.daysofleave}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formReason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={reason}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <Button
              variant="primary"
              style={{
                backgroundColor: '#E55A1B',
                color: 'white',
                borderRadius: '7px',
                border: 'none',
                width: '200px', // Adjust width as needed
              }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>

            <Button
              variant="secondary"
              style={{
                backgroundColor: '#E55A1B',
                borderRadius: '7px',
                color: 'white',
                border: 'none',
                width: '100px', // Adjust width as needed
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditLeave;
