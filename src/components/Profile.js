import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGetUserDetails = async () => {
    await axios
      .get(`http://localhost:8000/auth/getUsers/${id}`)
      .then((res) => {
        // console.log("here");
        console.log(res.data.getUserResult);
        setUserDetails(res.data.getUserResult[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  const handleLogOutUser = async () => {
    await axios
      .patch(`http://localhost:8000/auth/logOutUser/${id}`)
      .then(() => {
        // console.log("here");
        navigate(`/login`);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  useEffect(() => {
    handleGetUserDetails();
  }, [isLoading]);

  if (!isLoading)
    return (
      <div className="w-1/4 h-2/3 border rounded">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex w-2/5 justify-center items-center py-2">
            <div className="h-16 w-16 rounded-[5rem] justify-center items-center flex text-[3rem]">
              <FaRegUser />
            </div>
            <div className="flex flex-col justify-center items-center ml-8">
              <span className="text-xl font-semibold">{userDetails.name}</span>
              <span className="text-sm italic">{userDetails.userName}</span>
            </div>
          </div>
          <div className="flex flex-col justify-around items-center h-full px-8 py-12 w-full">
            <div className="flex py-4 px-4 border rounded bg-[#C6FFBB] w-full text-lg">
              Connections {userDetails.connections.length}
            </div>
            <div className="flex py-4 px-4 border rounded bg-[#C6FFBB] w-full text-lg">
              Last Visited
            </div>
            {/* <div className="flex">Change Password </div> */}
            <div className="flex justify-end w-full mt-8">
              <button
                className="px-4 py-1 border rounded bg-[#C6FFBB] hover:bg-[#3CFF31] flex justify-center items-center"
                onClick={() => {
                  handleLogOutUser();
                }}
              >
                Logout <MdArrowForwardIos />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;
