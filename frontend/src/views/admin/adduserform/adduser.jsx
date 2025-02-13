import React, { useEffect, useState } from "react";
import { Form, Button, Alert, FormGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/LeaveForm.css";

const LeaveForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
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
    password: "",
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

  const uploadImage = async () => {
    if (!file) return null;  // Return null if no file is selected
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Images");
    data.append("cloud_name", "diltqwt04");
    data.append("folder", "Cloudinary-React");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/diltqwt04/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      setImageUrl(res.url);  // Set the image URL
      setLoading(false);
      return res.url;  // Return the URL to be used in form data
    } catch (error) {
      setLoading(false);
      alert("Error uploading image");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If file is selected but no image URL is set, upload the image first
    if (file && !imageUrl) {
      const uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        return;  // If the image upload fails, return without submitting the form
      }
    }

    try {
      const checkResponse = await axios.post("https://mini-hrms.onrender.com/check-user", {
        emp_code: formData.emp_code,
        name: formData.name,
      });

      if (checkResponse.data.exists) {
        alert("Employee Code or Name already exists!");
        return;
      }

      // Add the profile_picture URL to formData
      const formDataToSend = { ...formData, profile_picture: imageUrl };

      await axios.post("https://mini-hrms.onrender.com/add-user", formDataToSend);
      // Clear form after submission
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
        password: "",
      });
      setFile(null);
      setSubmitted(true);
      alert("Employee details saved successfully!");
      navigate("/admin/data-tables");
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
                <FormControl
                  type={field.type}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  name={field.name}
                />
              </FormGroup>
            ))}

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
                <option value="" disabled>Select Department</option>
                {["Sales", "Production", "Support", "Accounts", "IT", "Operation"].map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </FormControl>
            </FormGroup>

            <FormGroup controlId="profile_picture">
              <Form.Label>Upload Profile Picture:</Form.Label>
              <FormControl type="file" accept="image/*" onChange={handlePictureChange} name="profile_picture" />
            </FormGroup>

            <Button
              disabled={loading}
              style={{ display: "block", margin: "20px auto", backgroundColor: "#E55A1B", color: "white", border: "none", width: "200px" }}
              type="submit"
            >
              {loading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LeaveForm;
