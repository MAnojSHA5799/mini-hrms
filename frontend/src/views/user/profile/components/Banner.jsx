import React, { useState, useEffect } from 'react';
import avatar from "assets/img/avatars/anand.png";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { useLocation } from 'react-router-dom'; // Import useLocation
const Banner = () => {
  const location = useLocation(); // Use useLocation hook
  const { user } = location.state || {}; // Destructure the user from state
  const [storedUser, setStoredUser] = useState(null);
  const [darkmode, setDarkmode] = React.useState(false);
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

let base64String = "";
if (storedUser && storedUser.data && storedUser.data.data) {
  base64String = arrayBufferToBase64(storedUser.data.data);
}
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user')) || null; 
  setStoredUser(user);
}, []); 
  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
        <img
            className="h-[80px] w-[80px] rounded-full"
            src={base64String ? `data:image/png;base64,${base64String}` : avatar}
            // alt={storedUser ? storedUser.name : "User Avatar"}
          />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
        {storedUser ? storedUser.name : "User Avatar"}
        </h4>
        <p className="text-base font-normal text-gray-600">{storedUser ? storedUser.designation : "Production Team"} </p>
      </div>

      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        {/* <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
          <p className="text-sm font-normal text-gray-600">Posts</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            9.7K
          </p>
          <p className="text-sm font-normal text-gray-600">Followers</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            434
          </p>
          <p className="text-sm font-normal text-gray-600">Following</p>
        </div> */}
      </div>
    </Card>
  );
};

export default Banner;
