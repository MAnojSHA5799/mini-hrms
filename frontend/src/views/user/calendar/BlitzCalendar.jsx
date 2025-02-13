import { useEffect, useState } from "react";
import axios from "axios";
import Widget from "components/widget/Widget";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

const BlitzCalendar = () => {
  const [salary, setSalary] = useState(20000);
  const [workDays, setWorkDays] = useState(27);
  const [leaveData, setLeaveData] = useState(null);
  const [calculatedSalary, setCalculatedSalary] = useState(0);
  const [user, setUser] = useState(null);
  const [empCode, setEmpCode] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmpCode(parsedUser.emp_code);
      fetchLeaveData(parsedUser.emp_code);
    }
  }, []);

  const fetchLeaveData = async (employeeCode) => {
    try {
      const response = await axios.get(`https://mini-hrms.onrender.com/payroll?emp_code=${employeeCode}`);
      console.log(response.data);
      setLeaveData(response.data);

      // Calculate salary
      const totalLeaves = response.data?.total_days_of_leave || 0;
      const presentDays = workDays - totalLeaves;
      const calculatedSalary = (salary / workDays) * presentDays;
      setCalculatedSalary(calculatedSalary.toFixed(2)); // Round to 2 decimal places
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-3">
        <Widget icon={<MdBarChart className="h-7 w-5" color="#ff5722" />} title={"Basic Salary"} subtitle={salary} />
        <Widget icon={<IoDocuments className="h-6 w-5" color="#ff5722" />} title={"Working Days"} subtitle={workDays} />
        <Widget icon={<MdDashboard className="h-6 w-5" color="#ff5722" />} title={"Total Leave"} subtitle={leaveData?.total_days_of_leave ?? "Loading..."} />
        <Widget icon={<MdDashboard className="h-6 w-6" color="#ff5722" />} title={"Salary"} subtitle={calculatedSalary} />
      </div>
    </div>
  );
};

export default BlitzCalendar;
