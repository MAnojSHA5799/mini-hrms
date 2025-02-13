# HRMS (Human Resource Management System)

The HRMS is a comprehensive web application designed to streamline employee management, leave applications, and salary calculations. It provides separate dashboards for employees and administrators, ensuring efficient management of workforce operations.

---

## Features

### Employee Management
- **Add, Update, and View Employee Profiles**: Easily manage employee details, including personal information, job roles, and contact details.

### Leave Application
- **Apply for Leave**: Employees can submit leave requests for various types (e.g., sick leave, vacation, personal leave).
- **Leave Status Tracking**: Employees can track the status of their leave applications (pending, approved, or rejected).

### Salary Calculation
- **Automated Payroll**: The system calculates employee salaries based on the number of leaves taken, ensuring accurate payroll processing.

### Admin Dashboard
- **Leave Request Management**: Admins can approve or reject employee leave requests.
- **Employee Management**: Admins can add, update, or remove employee profiles.
- **Payroll Overview**: Admins can view and manage payroll data for all employees.

---

## Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud-based, e.g., MongoDB Atlas)
- **React** (for the frontend)

### Steps to Set Up

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MAnojSHA5799/mini-hrms.git
   cd mini-hrms
Install Dependencies:
In the root folder of your project, run:

bash
Copy
npm install
Set Up the Backend:
Navigate to the backend folder and install the required dependencies:

bash
Copy
cd backend
npm install
Configure Environment Variables:
Create a .env file in the backend directory and add the following variables:

ini
Copy
MONGO_URI=your_mongo_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret_key
Start the Backend Server:
In the backend directory, run:

bash
Copy
npm start
Set Up the Frontend:
Navigate to the frontend folder and start the React development server:

bash
Copy
cd ../frontend
npm start
Access the Application:
Open your browser and go to http://localhost:3000 to view the application.

Usage
Employee Dashboard
Login: Employees can log in using their credentials.

Profile Management: View and update personal details.

Leave Application: Submit and track leave requests.

Admin Dashboard
Login: Admins can log in using their credentials.

Leave Management: Approve or reject employee leave requests.

Employee Management: Add, update, or remove employee profiles.

Payroll Management: View and manage employee payroll data.

Technologies Used
Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JSON Web Tokens (JWT)

Styling: CSS or any preferred framework (e.g., Bootstrap, Tailwind CSS)

