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
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://manojshakya54:VV2F0ZbarJSRpstc@cluster0.htdtk.mongodb.net/";
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
  
      const usered = await Usered.findOne({ name: name });
      console.log("Usered from DB:", usered);  // Log the user fetched from the database
  
      if (!usered || !(await bcrypt.compare(password, usered.password))) {
        console.log("Invalid username or password");
        return res.status(401).json({ success: false, error: "Incorrect username or password" });
      }
  
      const token = jwt.sign({ userId: usered._id, username: usered.name }, JWT_SECRET, { expiresIn: "1h" });
      console.log("Generated JWT Token:", token);  // Log the generated JWT token
  
      res.json({ success: true, token, usered });
    } catch (error) {
      console.error("User Login Error:", error);
      res.status(500).json({ error: "An error occurred while processing your request" });
    }
  });
  

const storage = multer.memoryStorage(); // Store image in memory buffer
const upload = multer({ storage });

app.post("/add-user", upload.single("profile_picture"), async (req, res) => {
    try {
      console.log(req.body);
  
      const {
        emp_code, name, contact, email, aadhaar, pan,
        bank_details, emergency_contact, address, dob,
        dateofjoining, designation, department, password // Include password
      } = req.body;
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // Convert image to base64
      let profile_picture = null;
      if (req.file) {
        profile_picture = req.file.buffer.toString("base64"); // Convert to Base64 string
      }
  
      // Create new user with hashed password and image data
      const newUsered = new Usered({
        emp_code, name, contact, email, aadhaar, pan,
        bank_details, emergency_contact, address, dob,
        dateofjoining, designation, department,
        profile_picture,
        password: hashedPassword, // Save the hashed password
      });
  
      await newUsered.save();
  
      res.status(201).json({ message: "User added successfully!" });
    } catch (error) {
      console.error("Error saving user details:", error);
      res.status(500).json({ error: "Error saving user details" });
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
  console.log(results)
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
    const currentDate = new Date().toISOString().slice(0, 10);  // Get only the date portion 'YYYY-MM-DD'

    // Create a new user time sheet document
    const newTimeSheet = new UserTimeSheet({
      username: employeeUsername,
      emp_code: employeeCode,
      time_in: istTime,
      user_current_date: currentDate,
      latitude: latitude,
      longitude: longitude,
    });

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

    const todayDate = new Date().toISOString().slice(0, 10);
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
