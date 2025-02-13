import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditLeaveDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || {};
console.log("op",profile)
  const [formData, setFormData] = useState({
    name: profile.name || '',
    emp_code: profile.emp_code || '',
    username: profile.username || '',
    total_leaves: profile.total_leaves || '',
    taking_leaves: profile.taking_leaves || '',
    balance_leave: profile.balance_leave || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = formData.emp_code;
      const { emp_code, ...filteredFormData } = formData; // Remove emp_code from the data to avoid sending it again
      await axios.put(`https://blitzlearning-lms.onrender.com/editUserLeavesDetails/${userId}`, filteredFormData); // Make PUT request to update leave details

      // Redirect to the data table or any other page after saving
      navigate('/admin/leave-details');
    } catch (error) {
      console.error('Error saving user leave details:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
    <div className="leave-form-container">
      <h2>Edit Leaves</h2>
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData?.name || ""}
          onChange={handleInputChange}
          readOnly // Name is read-only since we are editing leave details
        />
      </Form.Group>
      <Form.Group controlId="formUserName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData?.username || ""}
          onChange={handleInputChange}
          readOnly // Name is read-only since we are editing leave details
        />
      </Form.Group>
      <Form.Group controlId="formTotalLeaves">
        <Form.Label>Total Leaves</Form.Label>
        <Form.Control
          type="number"
          name="total_leaves"
          value={formData.total_leaves}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formTakingLeaves">
        <Form.Label>Taking Leaves</Form.Label>
        <Form.Control
          type="number"
          name="taking_leaves"
          value={formData.taking_leaves}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formBalanceLeave">
        <Form.Label>Balance Leaves</Form.Label>
        <Form.Control
          type="number"
          name="balance_leave"
          value={formData.balance_leave}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: '#E55A1B',
          color:"white",
          border: 'none',
          marginTop: '20px',
          width: '200px', // Adjust the width as needed
        }}
        variant="primary"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? <Spinner animation="border" size="sm" /> : 'Save'}
      </Button>
    </Form>
    </div></div>
  );
};

export default EditLeaveDetail;
