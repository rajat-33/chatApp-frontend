import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaUser } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

const socket = io("http://localhost:8000"); // Use your backend server URL

let setMsgToggle = 1;
const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [timer, setTimer] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState(0);
  const [insideScreenElement, setInsideScreenElement] = useState("");
  const [lastClickOnUser, setLastClickOnUser] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
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

  const handleGetUserDetails = async () => {
    await axios
      .get(`http://localhost:8000/auth/getUsers/${id}`)
      .then((res) => {
        console.log("here", res.data.getUserResult.connections);
        setConnections(res.data.getUserResult.connections);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePendingRequests = async () => {
    await axios
      .get(`http://localhost:8000/request/getRequest/${id}`)
      .then((res) => {
        setPendingRequests(res.data.requestResults);
        // console.log("this is", res.data.requestResults);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickOnUser = (userName, activeStatus) => {
    console.log(connections);
    console.log(userName);
    console.log(activeStatus);
    setLastClickOnUser(userName);
    if (activeStatus && connections.find((e) => e == userName)) {
      setInsideScreenElement("chatView");
    } else {
      setInsideScreenElement("makeRequestView");
    }
  };

  const handleMakeRequest = async (userName) => {
    await axios
      .post(`http://localhost:8000/request/makeRequest`, {
        sender: id,
        receiver: userName,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteRequest = async (userName) => {
    await axios
      .delete(`http://localhost:8000/request/deleteRequest/${userName}/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAcceptRequest = async (userName) => {
    await axios
      .patch(`http://localhost:8000/request/acceptRequest/${userName}/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogOutUser = async () => {
    await axios
      .patch(`http://localhost:8000/auth/logOutUser/${id}`)
      .then(() => {
        navigate(`/login`);
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
    handlePendingRequests();
    handleGetUserDetails();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.onAny((eventName, ...args) => {
      if (
        eventName.endsWith(id) &&
        eventName.startsWith("chat") &&
        setMsgToggle
      ) {
        console.log(`Received event '${eventName}' ${args[0]}`);
        // Handle the event here
        setMessages((oldArray) => [...oldArray, args[0]]);
      }
      setMsgToggle = (setMsgToggle + 1) % 2;
    });

    socket.on("noOfActiveUsers", (val) => {
      setActiveUsers(val);
    });
  }, []);

  useEffect(() => {
    handleGetAllUsers(document.getElementById("searchUsersInputElement").value);
    handleGetActiveUsers();
    handlePendingRequests();
    handleGetUserDetails();
    console.log(1);
    setInterval(() => {
      setTimer((timer + 1) % 2);
    }, 10000);
  }, [timer]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex h-[calc(10%)] justify-end items-center border-y-[0.2rem] border-[#C6FFBB]">
        <div className="flex h-full w-3/4 justify-end items-center">
          <div className="w-3/5 text-center text-[2rem] font-semibold">
            &lt; ChatApp /&gt;
          </div>
          <div className="w-2/5 flex justify-around">
            <div
              className="flex justify-center items-center"
              title="Currently active users"
            >
              <span className="h-4 w-4 bg-[#3CFF31] rounded-lg"></span>
              <span className="ml-2">{activeUsers}</span>
            </div>
            <button
              className="w-12 h-12 rounded-[10rem] border flex justify-center items-center hover:bg-[#3CFF31] bg-[#9FFF8B] text-[1.75rem] border-2 p-1"
              title="Friends"
              onClick={() => {
                setInsideScreenElement("viewFriends");
              }}
            >
              <FaUserFriends />
              <span className="h-full text-sm text-[#FF0000] font-semibold">
                {connections.length}
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-[10rem] border flex justify-center items-center hover:bg-[#3CFF31] bg-[#9FFF8B] text-[1.75rem] border-2 p-1"
              title="Notifications"
              onClick={() => {
                setInsideScreenElement("viewNotifications");
              }}
            >
              <IoIosNotifications />
              <span className="h-full text-sm text-[#FF0000] font-semibold">
                {pendingRequests.length}
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-[10rem] border flex justify-center items-center hover:bg-[#3CFF31] bg-[#9FFF8B] text-[1.75rem] border-2"
              onClick={() => {
                handleLogOutUser();
              }}
              title="Logout"
            >
              <FaPowerOff />
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
              placeholder="Search users"
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
                      onClick={() => {
                        handleClickOnUser(u.userName, u.isActive);
                      }}
                    >
                      {connections && (
                        <div className="w-1/6 h-full flex justify-center items-center">
                          {connections.find((e) => e == u.userName) ? (
                            u.isActive ? (
                              <span className="h-3 w-3 text-[#3CFF31]">
                                <FaUserFriends />
                              </span>
                            ) : (
                              <span className="h-3 w-3 text-[#FF0000]">
                                <FaUserFriends />
                              </span>
                            )
                          ) : (
                            <span
                              className="h-3 w-3 text-[#00605E]"
                              onClick={() => {
                                handleMakeRequest(u.userName);
                              }}
                            >
                              <MdPersonAddAlt1 />
                            </span>
                          )}
                        </div>
                      )}
                      {/* <div className="w-1/6 h-full flex justify-center items-center">
                        {u.isActive ? (
                          <span className="h-3 w-3 bg-[#3CFF31] rounded-lg border"></span>
                        ) : (
                          <span className="h-3 w-3 bg-[#FF0000] rounded-lg border"></span>
                        )}
                      </div> */}
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
        <div className="h-full w-5/6 border-2 flex justify-end ">
          {insideScreenElement === "viewNotifications" ? (
            <div className="h-1/2 w-1/3 flex flex-col items-center z-10">
              <div className="flex w-full justify-center items-center">
                <span className="text-lg font-semibold my-2 w-full text-center">
                  Pending Requests
                </span>
                <button
                  className="flex justify-end pr-4 items-center relative z-2"
                  onClick={() => {
                    setInsideScreenElement("");
                  }}
                >
                  <span className="border-2 border-black rounded-[4rem] p-1">
                    <RxCross1 />
                  </span>
                </button>
              </div>
              {pendingRequests.map((ele, ind) => {
                return (
                  <div className="h-16 w-full flex justify-around items-center border">
                    <button
                      className="h-full text-[#FF0000]"
                      onClick={() => {
                        handleDeleteRequest(ele.sender);
                      }}
                    >
                      <RxCrossCircled />
                    </button>
                    <div className="flex flex-col justify-center items-center">
                      <span>{ele.timestamp}</span>
                      <span>{ele.sender}</span>
                    </div>
                    <button
                      className="text-[#3CFF31]"
                      onClick={() => {
                        handleAcceptRequest(ele.sender);
                      }}
                    >
                      <IoIosCheckmarkCircleOutline />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : insideScreenElement === "viewFriends" ? (
            <div className="h-1/2 w-1/4 border flex flex-col items-center z-10">
              <div className="flex w-full justify-center items-center">
                <span className="text-lg font-semibold my-2 w-full text-center">
                  Friends
                </span>
                <button
                  className="flex justify-end pr-4 items-center relative z-2"
                  onClick={() => {
                    setInsideScreenElement("");
                  }}
                >
                  <span className="border-2 border-black rounded-[4rem] p-1">
                    <RxCross1 />
                  </span>
                </button>
              </div>
              <div className="w-full flex flex-col">
                {connections.map((ele, ind) => {
                  return (
                    <div className="w-1/2 flex justify-center items-center">
                      <span className="h-3 w-3 text-[#2B2FFF]">
                        <FaUserFriends />
                      </span>
                      <span className="ml-4">{ele}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : insideScreenElement === "chatView" ? (
            <div className="w-full h-full">
              <div className="flex h-[calc(10%)] w-1/2 items-center border p-4">
                <span className="h-3 w-3 bg-[#3CFF31] border rounded-lg"></span>
                <span className="text-xl font-semibold ml-4">
                  {lastClickOnUser}
                </span>
              </div>
              <div className="flex flex-col h-[calc(90%)] border">
                <div className="flex flex-col h-[30rem] py-8 px-4 overflow-y-auto">
                  {messages.map((val, ind) => {
                    return (
                      <span className="w-5/6 py-2 px-4 bg-[#C6FFBB] my-4">
                        {val}
                      </span>
                    );
                  })}
                </div>
                <div className="flex h-[calc(15%)] border justify-center items-center">
                  <input
                    className="w-3/4 border-2 border-[#779C7D] rounded-lg h-1/2 px-2 py-1"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => {
                      setNewMsg(e.target.value);
                    }}
                  ></input>
                  <button
                    className=" border-2 border-[#779C7D] rounded-lg  px-2 py-1"
                    onClick={() => {
                      console.log(`${newMsg}`, `chat-${id}-${lastClickOnUser}`);
                      setMessages((oldArray) => [...oldArray, newMsg]);
                      socket.emit(`chat-${id}-${lastClickOnUser}`, newMsg);
                    }}
                  >
                    send
                  </button>
                </div>
              </div>
            </div>
          ) : insideScreenElement == "makeRequestView" ? (
            <div className="h-1/2 w-1/3 border flex flex-col items-center z-10">
              <span className="text-lg font-semibold my-2">Make Request</span>

              <div className="h-16 w-full flex justify-around items-center border">
                <button
                  className="h-full text-[#FF0000]"
                  onClick={() => {
                    setInsideScreenElement("");
                  }}
                >
                  <RxCrossCircled />
                </button>
                <div className="flex flex-col justify-center items-center">
                  <span>{lastClickOnUser}</span>
                </div>
                <button
                  className="text-[#3CFF31]"
                  onClick={() => {
                    handleMakeRequest(lastClickOnUser);
                  }}
                >
                  <IoIosCheckmarkCircleOutline />
                </button>
              </div>
            </div>
          ) : (
            <div>khali</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
