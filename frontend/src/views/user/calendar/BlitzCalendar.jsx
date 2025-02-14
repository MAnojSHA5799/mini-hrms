import { useEffect, useState } from "react";
import axios from "axios";
import Widget from "components/widget/Widget";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

const BlitzCalendar = () => {
  const [salary, setSalary] = useState("");
  const [workDays, setWorkDays] = useState("");
  const [leaveData, setLeaveData] = useState(null);
  const [calculatedSalary, setCalculatedSalary] = useState(null);
  const [presentDays, setPresentDays] = useState(null);
  const [absentDays, setAbsentDays] = useState(null);
  const [user, setUser] = useState(null);
  const [empCode, setEmpCode] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState({ salary: "", workDays: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmpCode(parsedUser.emp_code);
    }
  }, []);

  const validateInputs = () => {
    let valid = true;
    let newErrors = { salary: "", workDays: "" };

    if (!salary) {
      newErrors.salary = "Basic Salary is required";
      valid = false;
    }
    if (!workDays) {
      newErrors.workDays = "Working Days is required";
      valid = false;
    } else if (workDays <= 0) {
      newErrors.workDays = "Working Days must be greater than zero";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      fetchLeaveData(empCode);
    }
  };

  const fetchLeaveData = async (employeeCode) => {
    try {
      const response = await axios.get(`https://mini-hrms.onrender.com/payroll?emp_code=${employeeCode}`);
      console.log(response.data);
      setLeaveData(response.data);

      const totalLeaves = response.data?.total_days_of_leave || 0;
      const calculatedPresentDays = workDays - totalLeaves;
      const calculatedSalary = (salary / workDays) * calculatedPresentDays;

      setAbsentDays(totalLeaves);
      setPresentDays(calculatedPresentDays);
      setCalculatedSalary(calculatedSalary.toFixed(2));
      setShowResult(true);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  return (
    <div>
      {!showResult ? (
        <div className="p-4 border rounded-lg shadow-md bg-white w-1/2 mx-auto">
          <h2 className="text-lg font-semibold mb-4">Enter Details</h2>
          
          {/* Salary Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
          </div>

          {/* Working Days Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Working Days</label>
            <input
              type="number"
              value={workDays}
              onChange={(e) => setWorkDays(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {errors.workDays && <p className="text-red-500 text-sm">{errors.workDays}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded-md ${
              !salary || !workDays ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
            disabled={!salary || !workDays}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 3xl:grid-cols-4">
          <Widget icon={<MdBarChart className="h-7 w-5" color="#ff5722" />} title={"Basic Salary"} subtitle={salary} />
          <Widget icon={<IoDocuments className="h-6 w-5" color="#ff5722" />} title={"Working Days"} subtitle={workDays} />
          <Widget icon={<MdDashboard className="h-6 w-5" color="#ff5722" />} title={"Absent Days"} subtitle={absentDays ?? "Loading..."} />
          <Widget icon={<MdDashboard className="h-6 w-5" color="#ff5722" />} title={"Present Days"} subtitle={presentDays ?? "Loading..."} />
          <Widget icon={<MdDashboard className="h-6 w-6" color="#ff5722" />} title={"Calculated Salary"} subtitle={calculatedSalary ?? "Loading..."} />
        </div>
      )}
    </div>
  );
};

export default BlitzCalendar;
