const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
app.use(express.json());
app.use(cors({
  // origin: "http://localhost:3000",
  origin: "https://mini-hrms.vercel.app",
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// MongoDB Connection
const mongoURI =  "mongodb+srv://manojshakya54:VV2F0ZbarJSRpstc@cluster0.htdtk.mongodb.net/";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// MongoDB Models
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
});
const UseredSchema = new mongoose.Schema({
    emp_code: String,
    name: String,
    contact: String,
    email: String,
    aadhaar: String,
    pan: String,
    bank_details: String,
    emergency_contact: String,
    address: String,
    dob: String,
    dateofjoining: String,
    designation: String,
    department: String,
    profile_picture: String,
    password: String, // Add password field
});

const leaveApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emp_code: { type: String, required: true },
  leave_type: { type: String, required: true },
  applied_leave_dates: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  days_of_leave: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, default: "Pending" },
  email: { type: String, required: true },
  total_leaves: { type: Number, required: true },
  leave_duration: { type: String, required: true }
});
  
const userTimeSheetSchema = new mongoose.Schema({
  username: String,
  emp_code: String,
  time_in: Date,
  time_out: Date,
  user_current_date: String,
  latitude: Number,
  longitude: Number,
});

const Admin = mongoose.model("Admin", AdminSchema);
const Usered = mongoose.model("Usered", UseredSchema); // Renamed to Usered
const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
const UserTimeSheet = mongoose.model('UserTimeSheet', userTimeSheetSchema);
// Utility Functions
const formatDateToDDMMYYYY = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

const incrementDate = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Admin Login
app.post("/adminlogin", async (req, res) => {
  try {
    console.log(req.body)
    const { name, password } = req.body;
    const admin = await Admin.findOne({ username: name });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const token = jwt.sign({ adminId: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ success: true, token, admin });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Usered Login
app.post("/userlogin", async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log("Request Body:", req.body);  // Log the incoming request body

    const usered = await Usered.findOne({ name: name });  // Search for user by name
    console.log("Usered from DB:", usered);  // Log the user fetched from the database

    if (!usered || !(await bcrypt.compare(password, usered.password))) {
      console.log("Invalid username or password");
      return res.status(401).json({ success: false, error: "Incorrect username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: usered._id, username: usered.name }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Generated JWT Token:", token);  // Log the generated JWT token

    // Return the user data, including the image URL (img or profile_picture)
    res.json({ 
      success: true, 
      token, 
      usered: {
        ...usered._doc,  // Spread to include all user fields
        profile_picture: usered.profile_picture  // Send the image URL in the response
      } 
    });
  } catch (error) {
    console.error("User Login Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

  

const storage = multer.memoryStorage(); // Store image in memory buffer
const upload = multer({ storage });

app.post("/add-user", async (req, res) => {
  try {
    console.log(req.body);

    const {
      emp_code, name, contact, email, aadhaar, pan,
      bank_details, emergency_contact, address, dob,
      dateofjoining, designation, department, password,profile_picture
    } = req.body;

    // Check if emp_code or name already exists
    const existingUser = await Usered.findOne({
      $or: [{ emp_code }, { name }]
    });

    if (existingUser) {
      return res.status(400).json({ error: "Employee Code or Name already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Convert image to base64
    // let profile_picture = null;
    // if (req.file) {
    //   profile_picture = req.file.buffer.toString("base64");
    // }

    // Create new user
    const newUsered = new Usered({
      emp_code, name, contact, email, aadhaar, pan,
      bank_details, emergency_contact, address, dob,
      dateofjoining, designation, department,
      password: hashedPassword,
      profile_picture,
    });

    await newUsered.save();
    res.status(201).json({ message: "User added successfully!" });

  } catch (error) {
    console.error("Error saving user details:", error);
    res.status(500).json({ error: "Error saving user details" });
  }
});
app.post("/check-user", async (req, res) => {
  try {
    const { emp_code, name } = req.body;
    const existingUser = await Usered.findOne({
      $or: [{ emp_code }, { name }]
    });

    if (existingUser) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  app.get('/userProfiles', async (req, res) => {
    try {
      const users = await Usered.find(); // Fetch all users from MongoDB
      res.json({ success: true, data: users });
      console.log(users)
    } catch (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ success: false, error: 'An error occurred while fetching user profiles' });
    }
  });
  
  app.delete('/userProfiles/:emp_code', async (req, res) => {
    try {
      const { emp_code } = req.params;
  console.log(emp_code)
      // Find and delete the user by emp_code
      const deletedUser = await Usered.findOneAndDelete({ emp_code });
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      res.json({ message: 'User profile deleted successfully', deletedUser });
    } catch (err) {
      console.error('Error deleting user profile:', err);
      res.status(500).json({ error: 'Error deleting user profile' });
    }
  });
  
  app.put('/userProfiles/:emp_code', async (req, res) => {
    try {
        console.log(req.body)
      const { emp_code } = req.params;
      const { name, dateofjoining, dob, designation, department } = req.body;
  
      // Update user profile in Usered collection
      const updatedUser = await Usered.findOneAndUpdate(
        { emp_code },
        { name, dateofjoining, dob, designation, department },
        { new: true } // Return updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      // Update corresponding name in leave_application collection
    //   await LeaveApplication.updateMany(
    //     { emp_code },
    //     { name }
    //   );
  
      res.json({ message: 'User profile updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Error updating user profile' });
    }
  });

  app.post('/leave-applications', async (req, res) => {
    try {
      const { 
        name, empCode, leaveType, startDate, endDate, 
        daysOfLeave, reason, status, email, 
        total_leave, depart, leaveDuration 
      } = req.body;
      
      console.log(req.body);
      
      // Convert UTC time to IST
      const utcTime = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(utcTime.getTime() + istOffset);
      const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');
  
      const currentDate = new Date().toISOString().slice(0, 10);
  
      // Set daysOfLeave to 0 if leave type is 'Special Leave'
      const leaveDaysCount = leaveType === "Special Leave" ? 0 : daysOfLeave;
      
      // Create a new leave application document
      const newLeaveApplication = new LeaveApplication({
        name,
        emp_code: empCode,
        leave_type: leaveType,
        applied_leave_dates: currentDate,
        start_date: startDate,
        end_date: endDate,
        days_of_leave: leaveDaysCount,
        reason,
        status,
        email,
        total_leaves: total_leave,
        leave_duration: leaveDuration
      });
  
      // Save the document to MongoDB
      await newLeaveApplication.save();
  
      console.log("Leave application submitted successfully");
      res.status(201).json({ message: 'Leave application submitted successfully' });
  
    } catch (err) {
      console.error('Error creating leave application:', err);
      res.status(500).json({ error: 'Error creating leave application' });
    }
  });

  app.get('/leavedetails/:employeeCode', async (req, res) => {
    try {
      const empCode = req.params.employeeCode;
  
      // Fetch leave details from leave_application collection
      const results = await LeaveApplication.find({ emp_code: empCode });
  console.log("316",results)
      res.json(results);
    } catch (err) {
      console.error('Error fetching leave data: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.put('/leavedetails/:id', async (req, res) => {
    const id = req.params.id;  // Getting the leave application ID
    const updatedLeave = req.body;  // Data to update
    console.log("Updated Leave Details:", updatedLeave);
  
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid leave application ID' });
    }
  
    try {
      // Find and update the leave application in the database
      const result = await LeaveApplication.findByIdAndUpdate(
        id,
        {
          leave_type: updatedLeave.leavetype,
          start_date: updatedLeave.startdate,
          end_date: updatedLeave.enddate,
          days_of_leave: updatedLeave.daysofleave,
          reason: updatedLeave.reason,
          status: updatedLeave.status,
          applied_leave_dates: updatedLeave.applied_leave_dates,
        },
        { new: true }  // This returns the updated document
      );
  
      if (!result) {
        return res.status(404).json({ error: "Leave application not found" });
      }
  
      // If you want to send an email after updating, call email sending function here
      // sendEmailNotification(result);  // Example email function call
  
      res.status(200).json({ message: 'Leave application updated successfully' });
  
    } catch (error) {
      console.error("Error updating leave data:", error);
      res.status(500).json({ error: "Failed to update leave data" });
    }
  });
  




app.post('/timein', async (req, res) => {
  try {
    console.log(req.body);
    const { employeeCode, employeeUsername, latitude, longitude } = req.body;

    // Validate required fields
    // if (!employeeCode || !employeeUsername || !latitude || !longitude) {
    //   return res.status(400).json({ error: "Employee code, username, latitude, and longitude are required." });
    // }

    // Get current UTC time and convert to IST
    const utcTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istTime = new Date(utcTime.getTime() + istOffset);
    const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' ');  // Format to 'YYYY-MM-DD HH:mm:ss'
    const currentDateLocal = new Date().toLocaleDateString("en-CA");  // Local date in YYYY-MM-DD format
console.log(currentDateLocal);


    // Create a new user time sheet document
    const newTimeSheet = new UserTimeSheet({
      username: employeeUsername,
      emp_code: employeeCode,
      time_in: istTime,
      time_out: null,
      user_current_date: currentDateLocal,
      latitude: latitude,
      longitude: longitude,
    });
console.log(newTimeSheet);
    // Save the new time sheet document to MongoDB
    await newTimeSheet.save();

    res.status(200).json({ message: 'Time in recorded successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error recording time in.' });
  }
});

app.get('/timesheet22', async (req, res) => {
  try {
    const { employeeCode, employeeUsername } = req.query;

    const todayDate = new Date().toLocaleDateString("en-CA"); // Local date in YYYY-MM-DD format
    console.log("1229", todayDate);

    // Query to get time sheet details for the given employee and date
    const timeSheetResults = await UserTimeSheet.find({
      emp_code: employeeCode,
      username: employeeUsername,
      user_current_date: todayDate,
    });

    // Combine the results (You can modify this if you want to include other data such as leaves)
    const response = {
      timeSheet: timeSheetResults,
    };
console.log("1229", response);
    res.json(response); // Return the response with time sheet details
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/timeout', async (req, res) => {
  try {
    const { employeeCode, employeeUsername } = req.body;

    // Get the current IST time
    const utcTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(utcTime.getTime() + istOffset);
    const istTimeString = istTime.toISOString().slice(0, 19).replace('T', ' '); // Format: "YYYY-MM-DD HH:MM:SS"
    const currentDate = new Date().toISOString().slice(0, 10); // Format: "YYYY-MM-DD"

    // Log the incoming data and calculated times
    console.log('Employee Code:', employeeCode);
    console.log('Employee Username:', employeeUsername);
    console.log('IST Time:', istTimeString);
    console.log('Current Date:', currentDate);

    // Find the time sheet entry and update the time_out field
    const result = await UserTimeSheet.updateOne(
      {
        emp_code: employeeCode,
        username: employeeUsername,
        user_current_date: currentDate,
      },
      { $set: { time_out: istTimeString } }
    );

    // Log the result of the update operation
    console.log('Update result:', result);

    // Check if any document was updated
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Time out recorded successfully.' });
    } else {
      res.status(404).json({ error: 'No matching time sheet entry found.' });
    }
  } catch (error) {
    console.error('Error updating data into MongoDB: ' + error.message);
    res.status(500).json({ error: 'Error recording time out.' });
  }
});

function calculateTimeDifference(timeIn, timeOut) {
  const timeInDate = new Date(timeIn);
  const timeOutDate = new Date(timeOut);

  // Check if both dates are valid
  if (isNaN(timeInDate) || isNaN(timeOutDate)) {
    return { totalMinutes: 0, hours: 0, minutes: 0 };
  }

  // Calculate the difference in milliseconds
  const timeDifferenceMs = timeOutDate - timeInDate;

  // Convert milliseconds to minutes
  const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

  // Optionally, convert minutes to hours and minutes format
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { totalMinutes, hours, minutes };
}

function calculateRemainingMinutes1(fixedMinutes, totalMinutes) {
  return fixedMinutes - totalMinutes;
}

app.get('/usertimeinDetails/:employeeCode', async (req, res) => {
  const empCode = req.params.employeeCode;
  try {
    // Query the MongoDB collection for the user's time sheet details
    const timeSheetData = await UserTimeSheet.find({
      emp_code: empCode
    });

    const fixedMinutes = 60; // Example fixed minutes, adjust as needed

    // Process the data and calculate time differences
    const processedData = timeSheetData.map(row => {
      // Add one day to user_current_date (if necessary)
      const currentDate = new Date(row.user_current_date);
      currentDate.setDate(currentDate.getDate()); // Adjust the current date as needed
      row.user_current_date = currentDate.toISOString().split('T')[0];

      // Ensure time_in and time_out are present before calculating the difference
      if (row.time_in && row.time_out) {
        // Calculate the time difference between time_in and time_out
        const { totalMinutes, hours, minutes } = calculateTimeDifference(row.time_in, row.time_out);

        // Calculate remaining minutes
        const remainingMinutes = calculateRemainingMinutes1(fixedMinutes, totalMinutes);

        return {
          ...row.toObject(), // Get the raw document data (MongoDB documents have toObject() method)
          totalMinutes,
          hours,
          minutes,
          remainingMinutes
        };
      } else {
        // Handle missing time_in or time_out (optional)
        return {
          ...row.toObject(),
          totalMinutes: 0,
          hours: 0,
          minutes: 0,
          remainingMinutes: 0
        };
      }
    });

    console.log(processedData); // Debugging log to see the processed data
    res.json(processedData);
  } catch (err) {
    console.error('Error fetching user profiles:', err);
    res.status(500).json({ error: 'An error occurred while fetching user profiles' });
  }
});

app.get('/leaveapplications', async (req, res) => {
  try {
    console.log(req.body); // This logs the incoming request body, if needed for debugging

    // Fetch leave applications from the 'LeaveApplication' collection
    const leaveApplications = await LeaveApplication.find();

    // Return leave application data directly
    const processedData = leaveApplications.map(leaveApp => {
      return {
        ...leaveApp.toObject(), // Get the raw data from the leave application
        userData: {
          name: '', // Empty string since no user data is fetched
          email: '', // Empty string since no user data is fetched
          data: '' // Empty string since no user data is fetched
        }
      };
    });

    // Send the processed data as the response
    res.json(processedData);
  } catch (err) {
    console.error('Error fetching leave applications:', err);
    res.status(500).json({ error: 'Error fetching leave applications' });
  }
});

app.get('/timeinDetails', async (req, res) => {
  try {
    // Query to fetch time sheet details from the 'UserTimeSheet' collection
    const timeSheetData = await UserTimeSheet.find({});

    // Directly return the time sheet data without any calculations
    res.json(timeSheetData);
  } catch (err) {
    console.error('Error fetching user profiles:', err);
    res.status(500).json({ error: 'An error occurred while fetching user profiles' });
  }
});
async function handleLeaveApplicationUpdate(req, res, status) {
  try {
    const { emp_code } = req.params;
    const { date, daysofleave } = req.body;
    console.log("Request Body:", req.body, emp_code);

    // Fetch leave application data from MongoDB
    const leaveApplication = await LeaveApplication.findOne({ emp_code, applied_leave_dates: date });

    if (!leaveApplication) {
      return res.status(404).send("Leave application not found");
    }

    // Update leave application status in MongoDB
    leaveApplication.status = status;
    await leaveApplication.save();

    console.log("Status updated successfully");
    res.status(200).send("Status updated successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error updating status");
  }
}

app.put('/leaveapplications/approve/:emp_code', (req, res) => {
  handleLeaveApplicationUpdate(req, res, 'Approved');
});

app.put('/leaveapplications/reject/:emp_code', (req, res) => {
  handleLeaveApplicationUpdate(req, res, 'Rejected');
});

app.get("/payroll", async (req, res) => {
  try {
    const { emp_code } = req.query;
    
    if (!emp_code) {
      console.log("❌ Missing emp_code in request");
      return res.status(400).json({ error: "Employee code is required" });
    }

    console.log(`🔍 Fetching payroll data for emp_code: ${emp_code}`);

    const leaves = await LeaveApplication.find({ emp_code });

    if (leaves.length === 0) {
      console.log(`⚠️ No payroll data found for emp_code: ${emp_code}`);
      return res.status(200).json({ message: "No payroll data found", total_days_of_leave: 0, leaves: [] });
    }

    // Calculate total days_of_leave
    const totalDaysOfLeave = leaves.reduce((sum, record) => sum + record.days_of_leave, 0);

    console.log(`✅ Payroll Data for emp_code ${emp_code}:`, JSON.stringify(leaves, null, 2));
    console.log(`📊 Total Days of Leave for emp_code ${emp_code}: ${totalDaysOfLeave}`);

    res.status(200).json({ total_days_of_leave: totalDaysOfLeave, leaves });
  } catch (error) {
    console.error("❌ Error fetching payroll data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/allpayroll", async (req, res) => {
  try {
    console.log("🔍 Fetching payroll data for all employees");

    // Fetch all leave records
    const leaves = await LeaveApplication.find();

    if (leaves.length === 0) {
      console.log("⚠️ No payroll data found for any employees");
      return res.status(200).json({ message: "No payroll data found", total_days_of_leave: 0, leaves: [] });
    }

    // Calculate total days of leave for each employee
    const employeeLeaveData = [];

    // Group leave records by employee
    const groupedLeaves = leaves.reduce((acc, record) => {
      const empCode = record.emp_code;
      if (!acc[empCode]) {
        acc[empCode] = {
          emp_code: empCode,
          name: record.name,
          total_days_of_leave: 0,
          leaves: []
        };
      }
      acc[empCode].total_days_of_leave += record.days_of_leave;
      acc[empCode].leaves.push(record);
      return acc;
    }, {});

    // Prepare data to send in the response
    for (let empCode in groupedLeaves) {
      employeeLeaveData.push(groupedLeaves[empCode]);
    }

    console.log("✅ Payroll Data for all employees:", JSON.stringify(employeeLeaveData, null, 2));

    res.status(200).json({ employeeLeaveData });
  } catch (error) {
    console.error("❌ Error fetching payroll data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/employees', async (req, res) => {
  try {
    // Replace this SQL query with MongoDB query
    const employees = await UserTimeSheet.find({});  // Fetch emp_code and name fields

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
console.log("749",employees)
    res.json(employees);
  } catch (err) {
    console.error('Error fetching user profiles:', err);
    res.status(500).json({ error: 'Error fetching user profiles' });
  }
});


// Update Usered (Protected)
app.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const updatedUsered = await Usered.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUsered) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User information updated successfully", user: updatedUsered });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Auto API Hit Every 50 Seconds
setInterval(async () => {
  try {
    const response = await axios.get(`http://localhost:${port}/`);
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error hitting API:", error.message);
  }
}, 50000);

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
