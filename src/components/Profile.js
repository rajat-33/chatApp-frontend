import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const { id } = useParams();
  const handleGetUserDetails = async () => {
    await axios
      .get(`http://localhost:8000/auth/getUsers/${id}`)
      .then((res) => {
        // console.log("here");
        console.log(res.data.getUserResult);
        setUserDetails(res.data.getUserResult[0]);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  useEffect(() => {
    handleGetUserDetails();
  }, []);

  if (userDetails)
    return (
      <div className="w-1/3 h-2/3 border">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex w-2/5 justify-around items-center border py-2">
            <div className="h-16 w-16 rounded-[5rem] border justify-center items-center flex text-[3rem]">
              {userDetails.name[0]}
            </div>
            <div className="flex flex-col justify-center items-center border">
              <span className="text-lg font-bold">{userDetails.name}</span>
              <span>{userDetails.userName}</span>
            </div>
          </div>
          <div className="flex flex-col justify-around items-center border h-full px-8 py-16 w-full">
            <div className="flex py-4 px-4 border rounded bg-[#C6FFBB] w-3/4 text-lg">
              Connections {userDetails.connections.length}
            </div>
            <div className="flex py-4 px-4 border rounded bg-[#C6FFBB] w-3/4 text-lg">
              Pending Requests {}
            </div>
            <div className="flex py-4 px-4 border rounded bg-[#C6FFBB] w-3/4 text-lg">
              Last Visited
            </div>
            {/* <div className="flex">Change Password </div> */}
            <div className="flex justify-end w-full">
              <button className="px-4 py-1 border rounded bg-[#C6FFBB] hover:bg-[#3CFF31]">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;
