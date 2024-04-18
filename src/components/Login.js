import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-1/4 h-1/2 flex flex-col justify-around items-center border-2 border-[#A8A8A8] rounded">
      <div className="w-full flex justify-center py-4">
        <span className="flex justify-around items-center rounded h-8 text-lg">
          Log Into Your Account!
        </span>
      </div>
      <input
        className="border-b-2 border-black w-1/2 pl-1 focus:border-red-600"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        placeholder="Username"
      ></input>
      <input
        className="border-b-2 border-black w-1/2 pl-1 focus:border-red-600"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Password"
      ></input>
      <div className="w-full flex justify-end px-8 py-4">
        <button className="flex justify-around items-center w-1/4 border rounded h-8">
          Go <MdArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default Login;
