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
  const [showForm, setShowForm] = useState(true); // Show/hide form for inputs

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
      const response = await axios.get("https://mini-hrms.onrender.com/allpayroll");
      if (response.data && response.data.employeeLeaveData) {
        setLeaveData(response.data.employeeLeaveData); // Assuming response has employeeLeaveData
        console.log("Leave data fetched:", response.data.employeeLeaveData); // Debugging log
      } else {
        console.error("No employeeLeaveData found in response");
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const handleEmployeeSelect = (emp_code) => {
    setSelectedEmployee(emp_code);

    // Find employee from leave data
    const employee = leaveData.find((emp) => emp.emp_code === emp_code);
    if (employee) {
      setSalary(employee.basic_salary); // Set salary from selected employee
      setWorkDays(employee.total_work_days); // Set work days from selected employee
      console.log("Employee selected:", employee); // Debugging log
    }
  };

  const handleSubmit = () => {
    setShowForm(false); // Hide form and show data
    console.log("Leave Data:", leaveData);
    console.log("Selected Employee Data:", selectedEmployee);
    console.log("Salary:", salary);
    console.log("Work Days:", workDays);

    // Find selected employee data from the leave data
    const selectedEmployeeData = leaveData.find((emp) => emp.emp_code === selectedEmployee);
    
    // Calculate salary
    if (selectedEmployeeData) {
      const totalLeaves = selectedEmployeeData.total_days_of_leave || 0;
      const presentDays = workDays - totalLeaves;
      const calculatedSalaryValue = (salary / workDays) * presentDays;
      setCalculatedSalary(calculatedSalaryValue.toFixed(2)); // Store calculated salary
    }
  };

  return (
    <div>
      {/* Show form if data is not loaded yet */}
      {showForm ? (
        <div className="p-4 border rounded-lg shadow-md bg-white w-1/2 mx-auto">
          <h2 className="text-lg font-semibold mb-4">Select Employee & Enter Details</h2>

          {/* Employee Dropdown */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Employee</option>
              {leaveData.length > 0 ? (
                leaveData.map((employee) => (
                  <option key={employee.emp_code} value={employee.emp_code}>
                    {employee.name}
                  </option>
                ))
              ) : (
                <option value="">No Employees Available</option>
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
        </div>
      ) : (
        <>
          {/* Show employee details and calculated salary after form submission */}
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
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{workDays}</td>
                    <td>{employee.total_days_of_leave}</td>
                    <td>{workDays - employee.total_days_of_leave}</td>
                    <td>{calculatedSalary}</td> {/* Display calculated salary */}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Calendar;
