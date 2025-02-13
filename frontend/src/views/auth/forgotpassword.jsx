import React, { useState } from "react";
import InputField from "components/fields/InputField";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle email, password, and confirm password changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Submit function to handle password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError("");

      // Log email and new password to console
  console.log("Email:", email);
  console.log("New Password:", password);

    try {
      // Make API request to check and update password
      const response = await axios.post("https://main-lms-backend-1.onrender.com/resetpassword", {
        email,
        newPassword: password
      });

      if (response.data.success) {
        alert("Password successfully updated!");
        navigate("/hrms"); // Redirect to login after success
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-0 mb-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Reset Password
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Change Your Password
        </p>

        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@blitzlearning.in"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="New Password*"
          placeholder="Enter new password"
          id="new-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Confirm Password*"
          placeholder="Confirm new password"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner animation="border" size="sm" /> : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
