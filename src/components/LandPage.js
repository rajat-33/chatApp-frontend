import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8000"); // Use your backend server URL
const LandPage = () => {
  const [msg, setMsg] = useState("");
  const [receiver, setReceiver] = useState("");
  const [val, setVal] = useState("");
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    // Example: listen for 'connect' event
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on(id, (msg) => {
      console.log("revert msg", msg);
      setVal(msg.msg);
    });

    // Clean up on unmount
  }, [id]);

  return (
    <>
      <textarea value={val}></textarea>
      <input
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
        placeholder="msg"
      ></input>
      <input
        value={receiver}
        onChange={(e) => {
          setReceiver(e.target.value);
        }}
        placeholder="receiver"
      ></input>
      <button
        onClick={() => {
          socket.emit("chatup", { sender: id, receiver: receiver, msg: msg });
          console.log("send");
        }}
      >
        Send
      </button>
    </>
  );
};

export default LandPage;
