import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Use your backend server URL

const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [timer, setTimer] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGetAllUsers = async (latestSearchString) => {
    await axios
      .get(`http://localhost:8000/auth/getUsers/${latestSearchString}`)
      .then((res) => {
        // console.log(res);
        setAllUsers(res.data.getUserResult);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  const handleGetActiveUsers = async () => {
    await axios
      .get(`http://localhost:8000/auth/getUsers`)
      .then((res) => {
        // console.log("here");
        setActiveUsers(
          res.data.getUserResult.filter((e) => {
            return e.isActive;
          }).length
        );
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate(`/login`);
    }
    handleGetAllUsers(document.getElementById("searchUsersInputElement").value);
    handleGetActiveUsers();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("noOfActiveUsers", (val) => {
      setActiveUsers(val);
    });
  }, []);

  useEffect(() => {
    handleGetAllUsers(document.getElementById("searchUsersInputElement").value);
    handleGetActiveUsers();
    setInterval(() => {
      setTimer((timer + 1) % 2);
    }, 5000);
  }, [timer]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex h-[calc(12%)] justify-end items-center border">
        <div className="flex h-full w-3/4 border justify-end items-center">
          <div className="w-3/5 border text-center text-[2rem] font-semibold">
            &lt; ChatApp /&gt;
          </div>
          <div className="w-2/5 border flex justify-around">
            <div className="flex justify-center items-center">
              <span className="h-4 w-4 bg-[#3CFF31] rounded-lg"></span>
              <span className="ml-2">{activeUsers}</span>
            </div>
            <button
              className="w-12 h-12 rounded-[10rem] border"
              onClick={() => {
                navigate(`/profile/${id}`);
              }}
            >
              profile
            </button>
          </div>
        </div>
      </div>
      <div className="flex h-full justify-center items-center border">
        <div className="flex h-full flex-col w-1/6 border justify-center items-center py-4">
          <div className="w-3/4 flex justify-center items-center border rounded-lg px-2 mb-4">
            <IoSearch />
            <input
              className="w-[10rem] px-2 py-1"
              placeholder="Search connections"
              onChange={(e) => {
                handleGetAllUsers(e.target.value);
              }}
              id="searchUsersInputElement"
            ></input>
          </div>
          <div className="h-[35rem] border flex flex-col w-full">
            <div className="overflow-y-scroll scrollable-container">
              {allUsers.map((u, ind) => {
                if (u.userName !== id) {
                  return (
                    <div
                      className="flex border h-[4rem] items-center"
                      key={ind}
                    >
                      <div className="w-1/6 h-full flex justify-center items-center">
                        {u.isActive && (
                          <span className="h-3 w-3 bg-[#3CFF31] rounded-lg border"></span>
                        )}
                      </div>
                      <div className="w-1/2 text-lg text-center">{u.name}</div>
                      <div className="w-1/3 text-sm text-center">
                        {u.userName}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col w-5/6 border">
          <div className="flex h-[calc(10%)] border"></div>
          <div className="flex h-full border"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
