import { useEffect, useState } from "react";
import axios from "axios";

const Calendar = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salary, setSalary] = useState(0);
  const [workDays, setWorkDays] = useState(0);
  const [calculatedSalary, setCalculatedSalary] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get("https://mini-hrms.onrender.com/allpayroll");
      if (response.data && Array.isArray(response.data.employeeLeaveData)) {
        setLeaveData(response.data.employeeLeaveData);
      } else {
        console.error("No valid employeeLeaveData found in response");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setIsLoading(false);
    }
  };

  const handleCalculateClick = (employee) => {
    setSelectedEmployee(employee);
    setSalary(employee.basic_salary || 0);
    setWorkDays(employee.total_work_days || 0);
    setShowPopup(true);
  };

  const handleSubmit = () => {
    if (selectedEmployee) {
      const totalLeaves = selectedEmployee.total_days_of_leave || 0;
      const presentDays = workDays - totalLeaves;
      const calculatedSalaryValue = (salary / workDays) * presentDays;
      setCalculatedSalary(calculatedSalaryValue.toFixed(2));
      
      setLeaveData((prevData) =>
        prevData.map((emp) =>
          emp.emp_code === selectedEmployee.emp_code
            ? { ...emp, total_work_days: workDays, present_days: presentDays, calculated_salary: calculatedSalaryValue.toFixed(2) }
            : emp
        )
      );
    }
    setShowPopup(false);
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
          <table className="mt-3 w-full table-auto border-collapse">
            <thead className="text-center bg-gray-200">
              <tr>
                <th className="p-2 border">Sn. No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Total Work Days</th>
                <th className="p-2 border">Total Days of Leave</th>
                <th className="p-2 border">Present Days</th>
                <th className="p-2 border">Calculated Salary</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {leaveData.map((employee, index) => (
                <tr key={employee.emp_code}>
                  <td data-label="Id">{index + 1}</td>
                  <td data-label="Name">{employee.name}</td>
                  <td data-label="Total Workdays">{employee.total_work_days || "-"}</td>
                  <td data-label="Total Leave">{employee.total_days_of_leave || "-"}</td>
                  <td data-label="Present Days">{employee.present_days || "-"}</td>
                  <td data-label="Salary">{employee.calculated_salary || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleCalculateClick(employee)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Total Work Days</label>
                  <input
                    type="number"
                    value={workDays}
                    onChange={(e) => setWorkDays(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={!salary || !workDays}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;
