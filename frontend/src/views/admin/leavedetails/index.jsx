import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, Modal, Button, Form,Spinner } from "react-bootstrap";
import CardEditLeaveDetails from "components/card/CardEditLeaveDetails";
import Card from "components/card";
import { format, isAfter, set } from 'date-fns';
import '../../../../src/assets/css/App.css'
const columnHelper = createColumnHelper();

function CheckTable() {
  const [users, setUser] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State variable to control delete modal visibility
  const [deletingUserId, setDeletingUserId] = useState(null); // State variable to store user ID being deleted
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching user profiles
  const [isSaving, setIsSaving] = useState(false); // Loading state for saving profile
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deleting profile
  // Fetch leave data
  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      const admin = JSON.parse(storedUser);
      setUser(admin);
      fetchUserProfiles();
    }
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const fetchUserProfiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://blitzlearning-lms.onrender.com/userProfilesLeaves");
      const sortedProfiles = response.data.sort(
        (a, b) => a.emp_code - b.emp_code
      );
      console.log(sortedProfiles);
      setUserProfiles(sortedProfiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
    setIsLoading(false);
  };

 

  const handleEdit = (emp_code) => {
    const profileToEdit = userProfiles.find(
      (profile) => profile.emp_code === emp_code
    );
    console.log("66",profileToEdit)
    navigate("/admin/edit-leaves", { state: { profile: profileToEdit } });
    
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
      await axios.put(
        `https://blitzlearning-lms.onrender.com/editUserLeavesDetails/${userId}`,
        filteredUser
      );
      fetchUserProfiles();
      setEditedUser(null);
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
    setIsSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
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
              <thead >
                <tr>
                  <th>Emp Code</th>
                  {/* <th>Profile</th> */}
                  <th>Name</th>
                  <th>User Name</th>
                  <th>Total Leaves</th>
                  <th>Leaves Taken</th>
                  <th>Balance Leaves</th>
                  {/* <th>Department</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userProfiles.map((profile, index) => (
                  <tr key={profile.emp_code}>
                    <td data-label="Emp Code">{profile.emp_code}</td>
                    {/* <td className="text-center">
                      <div className="profile-avatar">
                        {profile && profile.data && (() => {
                          const base64String = arrayBufferToBase64(profile.data.data);
                          return <img className='pro' key={index} src={`data:image/png;base64,${base64String}`} alt={`Image ${index}`} />;
                        })()}
                      </div>
                    </td> */}
                    <td data-label="Name" >{profile.name}</td>
                    <td data-label="Username">{profile.username}</td>
                    <td data-label="Total leaves">{profile.total_leaves}</td>
                    <td data-label="Leaves Taken">{profile.taking_leaves}</td>
                    <td data-label="Balance Leave">{profile.balance_leave}</td>
                    {/* <td>{profile.department}</td> */}
                    <td data-label="Actions"><CardEditLeaveDetails 
                     onEdit={() => handleEdit(profile.emp_code)}
                    /></td>
                    {/* <td>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: "#E55A1B ", color: "white" }} // Use any color value
                        size="sm"
                        onClick={() => handleEdit(profile.emp_code)}
                      >
                        Edit Leaves
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </Card>
    <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Leave Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Input fields for editing leave details */}
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={editedUser?.name || ""}
          onChange={handleInputChange}
          readOnly // Name is read-only since we are editing leave details
        />
      </Form.Group>
      <Form.Group controlId="formTotalLeaves">
        <Form.Label>Total Leaves</Form.Label>
        <Form.Control
          type="number"
          name="total_leaves"
          value={editedUser?.total_leaves || null}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formTakingLeaves">
        <Form.Label>Taking Leaves</Form.Label>
        <Form.Control
          type="number"
          name="taking_leaves"
          value={editedUser?.taking_leaves || null}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group controlId="formBalanceLeave">
        <Form.Label>Balance Leaves</Form.Label>
        <Form.Control
          type="number"
          name="balance_leave"
          value={editedUser?.balance_leave || null}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#E55A1B",
        border: "none",
        marginTop: "20px",
        width: "200px", // Adjust the width as needed
      }}
      variant="primary"
      onClick={handleSave}
      disabled={isSaving}
    >
      {isSaving ? <Spinner animation="border" size="sm" /> : "Save"}
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
}

export default CheckTable;
