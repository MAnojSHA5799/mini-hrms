import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, Modal, Button, Form,Spinner } from "react-bootstrap";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { format, isAfter, set } from 'date-fns';
import "../../../../assets/css/App.css";
import "../../../../assets/css/dashboard.css";
const columnHelper = createColumnHelper();

function CheckTable() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State variable to control delete modal visibility
  const [deletingUserId, setDeletingUserId] = useState(null); // State variable to store user ID being deleted
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching user profiles
  const [isSaving, setIsSaving] = useState(false); // Loading state for saving profile
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deleting profile
  const [users, setUser] = useState(null);
  const navigate = useNavigate();
  // Fetch leave data
  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      const admin = JSON.parse(storedUser);
      // setUser(admin);
      fetchUserProfiles();
      // fetchAdminName();
    }
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const fetchUserProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://mini-hrms.onrender.com/userProfiles');
      // const sortedProfiles = response.user.sort((a, b) => a.emp_code - b.emp_code);
      console.log("sasa",response.data)
      setUserProfiles(response.data.data);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
    setIsLoading(false);
  };

  const fetchAdminName = async () => {
    try {
      const response = await axios.get('https://mini-hrms.onrender.com/admin/profile');
      setAdminName(response.data.name);
    } catch (error) {
      console.error('Error fetching admin name:', error);
    }
  };

  // const handleEdit = (emp_code) => {
  //   const profileToEdit = userProfiles.find(profile => profile.emp_code === emp_code);
  //   setEditedUser(profileToEdit);
  //   setIsEditing(true);
  //   setShowModal(true); // Open the modal when editing starts
  // };


  const handleEdit = (emp_code) => {
    const profileToEdit = userProfiles.find(profile => profile.emp_code === emp_code);
    navigate("/admin/edit-profile", { state: { profile: profileToEdit } });
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setShowModal(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = editedUser.emp_code;
      const { data, ...filteredUser } = editedUser;
      await axios.put(`https://mini-hrms.onrender.com/userProfiles/${userId}`, filteredUser);
      fetchUserProfiles();
      setEditedUser(null);
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
    setIsSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDelete = async (emp_code) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user profile?");
    if (!confirmDelete) {
      return; // Exit function if user chooses "No"
    }
  
    setIsDeleting(true);
    try {
      const numericPart = emp_code;
      const userId = numericPart;
      console.log(userId)
      await axios.delete(`https://mini-hrms.onrender.com/userProfiles/${userId}`);
      fetchUserProfiles();
      setShowDeleteModal(false); // Close the delete confirmation modal
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }
    setIsDeleting(false);
  };
  

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        {/* <div className="text-xl font-bold text-navy-700 dark:text-white">
          User Leaves
        </div> */}
        {/* <CardMenu /> */}
      </header>

      <div className="mt-0 overflow-x-scroll xl:overflow-x-scroll">
      {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <table >
              <thead>
                <tr>
                  <th>Emp Code</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Date of Birth</th>
                  <th>Date of Joining</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {console.log(userProfiles)}
              {/* {console.log(`Profile  Image Data:`, userProfiles.profile_picture[1])} */}

                {userProfiles.map((profile, index) => (
                  <tr key={profile.emp_code}>

                    <td  data-label="Emp Code">{profile.emp_code}</td>
                    <td data-label="Profile" className="text-center">
                      <div className="profile-avatar">
                        {profile && profile.data && (() => {
                          const base64String = arrayBufferToBase64(profile.profile_picture
                          );
                          return <img className='pro' key={index} src={`data:image/png;base64,${base64String}`} alt={`Image ${index}`} />;
                        })()}
                      </div>
                    </td>
                    <td data-label="Name">{profile.name}</td>
                    <td data-label="Contact">{profile.contact}</td>
                    <td data-label="Date of Birth">{formatDate(profile.dob)}</td>
                    <td data-label="Date of Joining">{formatDate(profile.dateofjoining)}</td>
                    <td data-label="Designation">{profile.designation}</td>
                    <td data-label="Department">{profile.department}</td>
                    <td  data-label="Actions"><CardMenu 
                     onEdit={() => handleEdit(profile.emp_code)}
                     onDelete={() => handleDelete(profile.emp_code)}
                    /></td>
                    {/* <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(profile.emp_code)}>Edit Profile</Button>
                      <Button className='pr-5' style={{ marginLeft: '10px', marginRight: 'auto' }} variant="danger" size="sm" onClick={() => {
                        setShowDeleteModal(true);
                        setDeletingUserId(profile.emp_code);
                      }}>Delete</Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </Card>
  );
}

export default CheckTable;
