import { useEffect, useState } from "react";
import axios from "axios";

const Calendar = () => {
  const [salary, setSalary] = useState(null);
  const [workDays, setWorkDays] = useState(null);
  const [leaveData, setLeaveData] = useState([]);
  const [calculatedSalary, setCalculatedSalary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [user, setUser] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmpCode(parsedUser.emp_code);
      fetchLeaveData();
    }
  }, []);

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get("https://mini-hrms.onrender.com/allpayroll");
      if (response.data?.employeeLeaveData?.length > 0) {
        setLeaveData(response.data.employeeLeaveData);
      } else {
        setLeaveData([]); // Ensure empty array if no data
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLeaveData([]); // Ensure empty array on error
    }
  };

  const handleEmployeeSelect = (emp_code) => {
    setSelectedEmployee(emp_code);

    const employee = leaveData.find((emp) => emp.emp_code === emp_code);
    if (employee) {
      setSalary(employee.basic_salary);
      setWorkDays(employee.total_work_days);
    }
  };

  const handleSubmit = () => {
    setShowForm(false);

    const selectedEmployeeData = leaveData.find((emp) => emp.emp_code === selectedEmployee);
    
    if (selectedEmployeeData) {
      const totalLeaves = selectedEmployeeData.total_days_of_leave || 0;
      const presentDays = workDays - totalLeaves;
      const calculatedSalaryValue = (salary / workDays) * presentDays;
      setCalculatedSalary(calculatedSalaryValue.toFixed(2));
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-1/2 mx-auto">
      {showForm ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Select Employee & Enter Details</h2>

          {/* Employee Dropdown */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={leaveData.length === 0}
            >
              <option value="">Select Employee</option>
              {leaveData.length > 0 ? (
                leaveData.map((employee) => (
                  <option key={employee.emp_code} value={employee.emp_code}>
                    {employee.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No Employees Available</option>
              )}
            </select>
          </div>

          {/* Basic Salary Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Working Days Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Working Days</label>
            <input
              type="number"
              value={workDays || ""}
              onChange={(e) => setWorkDays(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={!selectedEmployee || !salary || !workDays}
          >
            Submit
          </button>
        </>
      ) : (
        <table className="mt-3 w-full table-auto border-collapse">
          <thead className="text-center bg-gray-200">
            <tr>
              <th className="p-2 border">Sn. No</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Total Work Days</th>
              <th className="p-2 border">Total Days of Leave</th>
              <th className="p-2 border">Present Days</th>
              <th className="p-2 border">Calculated Salary</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {leaveData
              .filter((employee) => employee.emp_code === selectedEmployee)
              .map((employee, index) => (
                <tr key={employee.emp_code}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{employee.name}</td>
                  <td className="p-2 border">{workDays}</td>
                  <td className="p-2 border">{employee.total_days_of_leave}</td>
                  <td className="p-2 border">{workDays - employee.total_days_of_leave}</td>
                  <td className="p-2 border">{calculatedSalary}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Calendar;
