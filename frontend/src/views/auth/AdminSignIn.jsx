import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Spinner, Modal, Form } from 'react-bootstrap';
// import homelogo from "../Images/Picture4.png";

export default function AdminSignIn() {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuccessfulLogin = (admin) => {
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('valid', true);
    navigate('/admin/default', { state: { admin } });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log("29",formData); // Log form data to the console
  
    try {
      const response = await axios.post('http://localhost:4000/adminlogin', formData);
      if (response.data.success) {
        console.log(response.data)
        handleSuccessfulLogin(response.data.admin);
      } else {
        setError('Incorrect username or password');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };
  

  const handleForgetPassword = async () => {
    setError('');
    setLoadingForgetPassword(true);
    try {
      const response = await axios.post('http://localhost:4000/forgetpassword', { email, password });
      if (response.data.success) {
        alert("Admin password changed successfully");
        setShowModal(false);
      } else {
        setError('Email not found');
      }
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setError('An error occurred while sending password reset request');
    } finally {
      setLoadingForgetPassword(false);
    }
  };

  return (
    <div className="mt-0 mb-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        {/* <Image style={{height:'80px',width:'150px'}} src={homelogo} alt="Logo" className="mb-4" />  */}
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Admin Login</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your email and password to sign in!</p>

        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            {/* <FcGoogle /> */}
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            <Link to="/auth/sign-in" className="text-navy-700 dark:text-white">User</Link>
          </h5>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          {/* <p className="text-base text-gray-600 dark:text-white"> or </p> */}
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Admin name"
            placeholder="Enter Username"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Enter Password"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

<div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            {/* <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p> */}
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
             href="/auth/forgot-password"
          >
            Forgot Password?
          </a>
        </div>

          <button type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
          </button>
        </form>

       
        {error && <p className="error-message text-white mt-3">{error}</p>}
        
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Forget Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Admin Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your admin name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              style={{ backgroundColor: '#E55A1B', border: 'none', width: '200px' }}
              onClick={handleForgetPassword}
              disabled={loadingForgetPassword}
            >
              {loadingForgetPassword ? <Spinner animation="border" size="sm" /> : 'Save'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
