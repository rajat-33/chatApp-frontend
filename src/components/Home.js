import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { IoIosNotifications } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import Modal from "./Modal";
import { FaMessage } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { IoPersonRemove } from "react-icons/io5";
import bcrypt from "bcryptjs-react";

const socket = io("http://localhost:8000"); // Use your backend server URL
const Home = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [timer, setTimer] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState(0);
  const [insideScreenElement, setInsideScreenElement] = useState("");
  const [lastClickOnUser, setLastClickOnUser] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isModalMsgPositive, setIsModalMsgPositive] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAuthenticateUser = async () => {
    const session_end_time = localStorage.getItem("session_end_time");
    const timeNow = Date.now();
    if (timeNow - session_end_time > 900000) {
      console.log(session_end_time);
      console.log(timeNow);
      console.log(timeNow - session_end_time);
      localStorage.removeItem("authToken");
    }
    await axios
      .get(`http://localhost:8000/auth/getUser/${id}`, {
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
        navigate(`/login`);
      });
  };
  const handleGetAllUsers = async (latestSearchString) => {
    console.log(latestSearchString);
    await axios
      .get(`http://localhost:8000/auth/getUsers/${latestSearchString}`)
      .then((res) => {
        console.log("sdfjbdshjvsg", res.data.getUserResult);
        setAllUsers(res.data.getUserResult || []);
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
      .get(`http://localhost:8000/auth/getUser/${id}`, {
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      })
      .then((res) => {
        console.log("here ", res.data.getUserResult.connections);
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
        setModalMsg("Request Sent!");
        setIsModalOpen(true);
        setIsModalMsgPositive(true);
        setInsideScreenElement("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setModalMsg(err.response.data.message);
        setIsModalOpen(true);
        setIsModalMsgPositive(false);
      });
  };

  const handleDeleteRequest = async (userName) => {
    await axios
      .delete(`http://localhost:8000/request/deleteRequest/${userName}/${id}`)
      .then((res) => {
        console.log(res.data);
        setModalMsg("Request Deleted!");
        setIsModalOpen(true);
        setIsModalMsgPositive(true);
      })
      .catch((err) => {
        console.log(err);
        setModalMsg(err.response.data.message);
        setIsModalOpen(true);
        setIsModalMsgPositive(false);
      });
  };

  const handleAcceptRequest = async (userName) => {
    await axios
      .patch(`http://localhost:8000/request/acceptRequest/${userName}/${id}`)
      .then((res) => {
        console.log(res.data);
        setModalMsg("Request Accepted!");
        setIsModalOpen(true);
        setIsModalMsgPositive(true);
        setInsideScreenElement("");
        setTimer(timer + 1);
      })
      .catch((err) => {
        console.log(err);
        setModalMsg(err.response.data.message);
        setIsModalOpen(true);
        setIsModalMsgPositive(false);
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
        setModalMsg("Can't Logout");
        setIsModalOpen(true);
        setIsModalMsgPositive(false);
      });
  };

  const handleRemoveFriend = async (userName) => {
    await axios
      .patch(`http://localhost:8000/auth/deleteFriend/${userName}/${id}`)
      .then(() => {
        setModalMsg("Friend Removed");
        setIsModalOpen(true);
        setIsModalMsgPositive(true);
        setInsideScreenElement("");
        setTimer(timer + 1);
      })
      .catch((err) => {
        console.log(err);
        setModalMsg("Can't Remove Friend!");
        setIsModalOpen(true);
        setIsModalMsgPositive(false);
      });
  };

  const getMessageTimestamp = () => {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let timeHere = hours + ":" + minutes + " AM";
    if (minutes < 10) minutes = "0" + minutes;
    if (hours < 10) timeHere = "0" + hours + ":" + minutes + " AM";
    if (hours > 12) timeHere = (hours % 12) + ":" + minutes + " PM";
    return timeHere;
  };

  const handleSendMessage = () => {
    const eventName = `chat-${id}-${lastClickOnUser}`;
    const storeName = `chat-${lastClickOnUser}-${id}`;
    setMessages((prevMessages) => {
      if (prevMessages.hasOwnProperty(storeName)) {
        return {
          ...prevMessages,
          [storeName]: [
            ...prevMessages[storeName],
            {
              msg: newMsg,
              isLeftSide: false,
              timestamp: getMessageTimestamp(),
            },
          ],
        };
      } else {
        return {
          ...prevMessages,
          [storeName]: [
            {
              msg: newMsg,
              isLeftSide: false,
              timestamp: getMessageTimestamp(),
            },
          ],
        };
      }
    });
    console.log("messages", messages);
    socket.emit(eventName, newMsg);
    setNewMsg("");
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate(`/login`);
    }
    handleGetAllUsers(document.getElementById("searchUsersInputElement").value);
    handleGetActiveUsers();
    handlePendingRequests();
    handleGetUserDetails();
    handleAuthenticateUser();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.onAny((eventName, ...args) => {
      if (eventName.endsWith(id) && eventName.startsWith("chat")) {
        console.log(`Received event '${eventName}' ${args[0]}`);
        console.log(args[0]);
        console.log(messages);
        setMessages((prevMessages) => {
          if (prevMessages.hasOwnProperty(eventName)) {
            return {
              ...prevMessages,
              [eventName]: [
                ...prevMessages[eventName],
                {
                  msg: args[0],
                  isLeftSide: true,
                  timestamp: getMessageTimestamp(),
                },
              ],
            };
          } else {
            return {
              ...prevMessages,
              [eventName]: [
                {
                  msg: args[0],
                  isLeftSide: true,
                  timestamp: getMessageTimestamp(),
                },
              ],
            };
          }
        });
        console.log("messages", messages);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("\ttime Run");
    handleAuthenticateUser();
    handleGetAllUsers(document.getElementById("searchUsersInputElement").value);
    handleGetActiveUsers();
    handlePendingRequests();
    handleGetUserDetails();
    console.log(1);
    setInterval(() => {
      setTimer((timer + 1) % 2);
    }, 10000);

    return () => {
      clearInterval();
    };
  }, [timer]);

  return (
    <div className="h-full w-full">
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          msg={modalMsg}
          isModalMsgPositive={isModalMsgPositive}
        />
      )}
      <div
        className={
          isModalOpen
            ? "opacity-40 disabled h-full w-full flex flex-col"
            : "h-full w-full flex flex-col"
        }
      >
        <div className="w-full flex h-[calc(10%)] justify-end items-center border-y-[0.2rem] border-[#C6FFBB]">
          <div className="w-1/4 h-full bg-[#11231E] flex">f</div>
          <div className="flex h-full w-3/4 justify-end items-center border">
            <div className="w-3/5 text-center text-[2rem] font-semibold text-[#11231E]">
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
          <div className="flex h-full flex-col w-1/4 border justify-center items-center py-4">
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
                        className="h-[5rem] flex flex-col w-full p-2 border justify-center"
                        key={ind}
                        onClick={() => {
                          handleClickOnUser(u.userName, u.isActive);
                        }}
                      >
                        <div className="flex items-center px-2 justify-center">
                          {connections && (
                            <div className="w-1/6 h-full flex justify-center items-center ">
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
                                <span className="h-3 w-3 text-[#00605E]">
                                  <MdPersonAddAlt1 />
                                </span>
                              )}
                            </div>
                          )}
                          <div className="w-1/2 text-lg">{u.name}</div>
                          <div className="w-1/3 text-sm text-center">
                            {u.userName}
                          </div>
                          <div className="px-2 text-sm text-center bg-[#1C55FF] font-semibold border rounded-[5rem] text-white">
                            {messages.hasOwnProperty(`chat-${u.userName}-${id}`)
                              ? messages[`chat-${u.userName}-${id}`].length
                              : 0}
                          </div>
                        </div>
                        <div className="flex justify-end items-end px-1 text-[#1C55FF]">
                          <span className="">
                            {messages.hasOwnProperty(
                              `chat-${u.userName}-${id}`
                            ) && <FaMessage />}
                          </span>
                          <span className="px-2 max-w-3/5 text-sm overflow-hidden text-ellipsis">
                            {messages.hasOwnProperty(
                              `chat-${u.userName}-${id}`
                            ) &&
                              messages[`chat-${u.userName}-${id}`][
                                messages[`chat-${u.userName}-${id}`].length - 1
                              ].msg}
                          </span>
                          <span className="pr-2 text-xs text-nowrap">
                            {messages.hasOwnProperty(
                              `chat-${u.userName}-${id}`
                            ) &&
                              messages[`chat-${u.userName}-${id}`][
                                messages[`chat-${u.userName}-${id}`].length - 1
                              ].timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <div className="h-full w-5/6 border-2 flex justify-end bg-[#11231E] text-white">
            {insideScreenElement === "viewNotifications" ? (
              <div className="h-1/4 w-1/3 flex flex-col items-center z-10 border border-white">
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
                <div className="overflow-y-auto w-full">
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
              </div>
            ) : insideScreenElement === "viewFriends" ? (
              <div className="h-1/4 w-1/6 border flex flex-col items-center z-10 border border-white px-4">
                <div className="flex w-full justify-around items-center">
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
                <div className="w-full flex flex-col overflow-y-auto">
                  {connections.map((ele, ind) => {
                    return (
                      <div className="w-1/2 flex items-center">
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
              <div className="w-full h-full flex flex-col bg-[#11231E]">
                <div className="flex items-center">
                  <div className="flex h-[calc(10%)] w-1/2 items-center p-4">
                    <span className="h-3 w-3 bg-[#3CFF31] border rounded-lg"></span>
                    <span className="text-xl font-semibold ml-4 text-white">
                      {lastClickOnUser}
                    </span>
                  </div>
                  <button
                    className="flex h-[calc(10%)] w-1/2 items-center justify-end p-4"
                    onClick={() => {
                      handleRemoveFriend(lastClickOnUser);
                    }}
                    title="Remove friend"
                  >
                    <span className="text-xl font-semibold ml-4 border p-2 rounded-[5rem] bg-[#FF0000]">
                      <IoPersonRemove />
                    </span>
                  </button>
                </div>

                <div className="flex flex-col h-[calc(90%)] border">
                  <div className="flex flex-col h-[30rem] py-8 px-4 overflow-y-auto text-black">
                    {messages.hasOwnProperty(`chat-${lastClickOnUser}-${id}`) &&
                      messages[`chat-${lastClickOnUser}-${id}`].map(
                        (val, ind) => {
                          if (val.isLeftSide)
                            return (
                              <div className="flex w-full my-4">
                                <span className="max-w-2/3 py-2 px-4 bg-[#EBFFE8] rounded-xl">
                                  <span>{val.msg}</span>
                                  <span className="ml-4 text-xs">
                                    {val.timestamp}
                                  </span>
                                </span>
                              </div>
                            );
                          else {
                            return (
                              <div className="flex w-full justify-end my-4">
                                <span className="max-w-2/3 py-2 px-4 bg-[#C6FFBB] rounded-xl">
                                  <span>{val.msg}</span>
                                  <span className="ml-4 text-xs">
                                    {val.timestamp}
                                  </span>
                                </span>
                              </div>
                            );
                          }
                        }
                      )}
                  </div>
                  <div className="flex h-[calc(15%)] justify-center items-center">
                    <input
                      className="w-3/4 border-2 border-[#779C7D] rounded-lg h-1/2 px-2 bg-[#11231E] text-white"
                      placeholder="Type a message..."
                      value={newMsg}
                      onChange={(e) => {
                        setNewMsg(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    ></input>
                    <button
                      className="text-[#779C7D] rounded-lg  px-2 py-1"
                      onClick={() => {
                        handleSendMessage();
                      }}
                    >
                      <IoSendSharp />
                    </button>
                  </div>
                </div>
              </div>
            ) : insideScreenElement == "makeRequestView" ? (
              <div className="h-fit w-1/3 border flex flex-col items-center z-10 border border-white">
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
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
