import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import festivaldata from "../festivalData";
import calendar from "../../../../src/assets/img/calendar/image.png"
import { Container, Image } from 'react-bootstrap';


const BlitzCalendar = ({ festivalData: propFestivalData }) => {
  const [festivalData, setFestivalData] = useState(festivaldata);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [applyDate, setApplyDate] = useState([]);
  const [users, setUser] = useState(null);
  const [empCode, setEmpCode] = useState();
  const [loading, setLoading] = useState(true);
  const [depart, setDepart] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [leaveDuration, setLeaveDuration] = useState("full");
  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      const admin = JSON.parse(storedUser);
      setUser(admin);
      setEmpCode(admin.emp_code);
      setEmail(admin.email);
      setDepart(admin.department);
    }

    const employeeCode = JSON.parse(storedUser).emp_code;
    if (employeeCode) {
    //   fetchLeaveData(employeeCode);
    }
  }, []);

  
  return (
    <div>
     
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 3xl:grid-cols-1">  
      <Image style={{ height: '100%', width: '100%' }} className="logo" src={calendar} alt="Logo" />
      </div>
  </div>
  );
};

export default BlitzCalendar;
