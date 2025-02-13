import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from "react-bootstrap"; // Import Bootstrap Spinner for loading effect
import InputField from "components/fields/InputField"; // Ensure this path is correct
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox"; // Ensure this path is correct
import { Link } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => { 
    console.log("ASDSSD"); // Log the field name and value
    const { name, value } = e.target; // Destructure name and value
    console.log("ASDSSD",name, value); // Log the field name and value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in the state
    }));
  };

  const handleSuccessfulLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('valid', true);
    navigate('/user/default', { state: { user } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData); // Log form data before setting loading state
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('https://mini-hrms.onrender.com/userlogin', formData);
      if (response.data.success) {
        console.log(response.data)
        handleSuccessfulLogin(response.data.usered);
      } else {
        setError('Incorrect email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Optional chaining for safer error checking
      if (error.response?.status === 401) {
        setError('Incorrect email or password');
      } else {
        setError('An error occurred while logging in');
      }
    }
    setIsLoading(false); // End loading
  };

  return (
    <div className="mt-0 mb-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
    <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
      <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Sign In</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your email and password to sign in!</p>

        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            {/* <FcGoogle /> */}
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            <Link to="/auth/admin-sign-in" className="text-navy-700 dark:text-white">Admin</Link>
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
            label="User name"
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
              {/* <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Keep me logged In</p> */}
            </div>
            <a className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white" href="/auth/forgot-password">Forgot Password?</a>
          </div>

          <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <div className="mt-4">
          {/* <span className="text-sm font-medium text-navy-700 dark:text-gray-600">Not registered yet?</span>
          <a href="#" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">Create an account</a> */}
        </div>
      </div>
    </div>
  );
}

export default SignIn; // Make sure to export the component at the end
