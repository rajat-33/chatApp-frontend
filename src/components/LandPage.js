import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:8000"); // Use your backend server URL
const LandPage = () => {
  const [msg, setMsg] = useState("");
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
      setVal(msg);
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
      ></input>
      <button
        onClick={() => {
          socket.emit("chatup", { userName: "u2", msg: msg });
          console.log("send");
        }}
      >
        Send
      </button>
    </>
  );
};

export default LandPage;
