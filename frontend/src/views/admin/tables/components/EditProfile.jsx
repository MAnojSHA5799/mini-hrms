import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || {};

  const [formData, setFormData] = useState({
    name: profile.name || '',
    emp_code: profile.emp_code || '',
    dob: profile.dob || '',
    dateofjoining: profile.dateofjoining || '',
    designation: profile.designation || '',
    department: profile.department || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updated form data:', formData);
    try {
      const userId = formData.emp_code; // Use emp_code from formData
      const { emp_code, ...filteredFormData } = formData; // Remove emp_code from the data to avoid sending it again
      await axios.put(`http://localhost:4000/userProfiles/${userId}`, filteredFormData); // Make PUT request to update profile
      
      // Reset form after successful update
      setFormData({
        name: '',
        emp_code: '',
        dob: '',
        dateofjoining: '',
        designation: '',
        department: '',
      });
  
      // Redirect to the profile or dashboard page (or any other route)
      navigate('/admin/data-tables'); // Update the URL to '/profile' or any path you want to redirect to
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  
  };
  
  

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
    <div className="leave-form-container">
      <h2>Edit Profile</h2>
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Employee Code</Form.Label>
        <Form.Control
          type="text"
          name="emp_code"
          value={formData.emp_code}
          onChange={handleInputChange} // Make it editable
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Date of Joining</Form.Label>
        <Form.Control
          type="date"
          name="dateofjoining"
          value={formData.dateofjoining}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Designation</Form.Label>
        <Form.Control
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Department</Form.Label>
        <Form.Control
          type="text"
          name="department"
          value={formData.department}
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
      variant="primary" type="submit">
        Update Profile
      </Button>
    </Form>
    </div></div>
  );
};

export default EditProfile;
