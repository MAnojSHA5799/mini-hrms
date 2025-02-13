import { useEffect, useState } from "react";
import axios from "axios";
import Widget from "components/widget/Widget";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

const BlitzCalendar = () => {
  const [salary, setSalary] = useState(20000);
  const [workDays, setWorkDays] = useState(27);
  const [leaveData, setLeaveData] = useState([]);
  const [calculatedSalary, setCalculatedSalary] = useState(0);
  const [user, setUser] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state

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
      const response = await axios.get(`https://mini-hrms.onrender.com/allpayroll`);
      console.log(response.data);
      setLeaveData(response.data.employeeLeaveData); // Assuming response has employeeLeaveData
      setIsLoading(false); // Stop loading

      // Calculate total leaves and present days for each employee
      response.data.employeeLeaveData.forEach((employee) => {
        const totalLeaves = employee.total_days_of_leave || 0;
        const presentDays = workDays - totalLeaves;
        const calculatedSalary = (salary / workDays) * presentDays;
        setCalculatedSalary((prevState) => ({
          ...prevState,
          [employee.emp_code]: calculatedSalary.toFixed(2), // Storing salary for each employee
        }));
      });
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setIsLoading(false); // Stop loading on error
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <table className="mt-3">
            <thead className="text-center">
              <tr>
                <th>Sn. no</th>
                <th>Name</th>
                <th>Total workDays</th>
                <th>Total Days of Leave</th>
                <th>Present Days</th>
                <th>Calculated Salary</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {leaveData.map((employee, index) => (
                <tr key={employee.emp_code}>
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{workDays}</td>
                  <td>{employee.total_days_of_leave}</td>
                  <td>{workDays - employee.total_days_of_leave}</td>
                  <td>{calculatedSalary[employee.emp_code]}</td> {/* Displaying the calculated salary */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BlitzCalendar;
