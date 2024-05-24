import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await axios
      .post(`http://localhost:8000/auth/login`, {
        userName: userName,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("authToken", res.data.auth_token);
        localStorage.setItem("session_end_time", res.data.session_end_time);
        navigate(`/chat/${userName}`);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  };

  return (
    <div className="w-1/4 h-1/2 flex flex-col justify-around items-center border-2 border-[#A8A8A8] rounded bg-[#C6FFBB]">
      <div className="w-full flex justify-center py-4">
        <span className="flex justify-around items-center rounded h-8 text-lg">
          Already have an account!
        </span>
      </div>
      <input
        className="border-b-2 border-black w-1/2 pl-1 focus:border-red-600 bg-[#C6FFBB]"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        placeholder="Username"
      ></input>
      <input
        className="border-b-2 border-black w-1/2 pl-1 focus:border-red-600 bg-[#C6FFBB]"
        value={password}
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Password"
      ></input>
      <div className="w-full flex justify-between px-8 py-4">
        <button
          className="hover:underline"
          onClick={() => {
            navigate(`/signup`);
          }}
        >
          Create a new account!
        </button>
        <button
          className="flex justify-around items-center w-1/4 border rounded h-8 hover:bg-[#9FFF8B]"
          onClick={handleLogin}
        >
          Go <MdArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default Login;
