import React, { useEffect, useState } from "react";
import { Form, Button, Alert, FormGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/LeaveForm.css";

const LeaveForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    emp_code: "",
    name: "",
    contact: "",
    email: "",
    aadhaar: "",
    pan: "",
    bank_details: "",
    emergency_contact: "",
    address: "",
    dob: "",
    dateofjoining: "",
    designation: "",
    department: "",
    password: "", // Add password to form data
  });

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePictureChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      if (file) formDataToSend.append("profile_picture", file);
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
  
      // Log formData values
      console.log("Form Data Values:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      await axios.post("http://localhost:4000/add-user", formDataToSend);
  
      setFormData({
        emp_code: "",
        name: "",
        contact: "",
        email: "",
        aadhaar: "",
        pan: "",
        bank_details: "",
        emergency_contact: "",
        address: "",
        dob: "",
        dateofjoining: "",
        designation: "",
        department: "",
        password: "", // Reset the password field
      });
      setFile(null);
      setSubmitted(true);
      alert("User details saved successfully!");
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="leave-form-container">
        <h2>Add User Form</h2>
        {submitted && <Alert variant="success">Form submitted successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <div style={{ padding: "20px" }}>
            {[
              { name: "emp_code", label: "Employee Code", type: "text" },
              { name: "name", label: "Name", type: "text" },
              { name: "contact", label: "Contact Number", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "aadhaar", label: "Aadhaar Number", type: "text" },
              { name: "pan", label: "PAN Number", type: "text" },
              { name: "bank_details", label: "Bank Details", type: "text" },
              { name: "emergency_contact", label: "Emergency Contact", type: "text" },
              { name: "address", label: "Address", type: "text" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "dateofjoining", label: "Date of Joining", type: "date" },
              { name: "designation", label: "Designation", type: "text" },
            ].map((field) => (
              <FormGroup key={field.name} controlId={field.name}>
                <Form.Label>{field.label}:</Form.Label>
                <FormControl type={field.type} placeholder={field.label} value={formData[field.name]} onChange={handleChange} required name={field.name} />
              </FormGroup>
            ))}

            {/* Password Field */}
            <FormGroup controlId="password">
              <Form.Label>Password:</Form.Label>
              <FormControl 
                type="password" 
                placeholder="Enter password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                name="password" 
              />
            </FormGroup>

            <FormGroup controlId="department">
              <Form.Label>Department:</Form.Label>
              <FormControl as="select" value={formData.department} onChange={handleChange} required name="department">
                <option value="" disabled>
                  Select Department
                </option>
                {["Sales", "Production", "Support", "Accounts", "IT", "Operation"].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </FormControl>
            </FormGroup>

            <FormGroup controlId="profile_picture">
              <Form.Label>Upload Profile Picture:</Form.Label>
              <FormControl type="file" accept="image/*" onChange={handlePictureChange} name="profile_picture" />
            </FormGroup>

            <Button style={{ display: "block", margin: "20px auto", backgroundColor: "#E55A1B", color: "white", border: "none", width: "200px" }} type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LeaveForm;
