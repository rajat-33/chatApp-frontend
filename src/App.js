import "./App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";

const App = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat/:id" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

  // const navigate = useNavigate();
  // const [userName, setUserName] = useState("");

  // return (
  //   <>
  //     <input
  //       value={userName}
  //       onChange={(e) => {
  //         setUserName(e.target.value);
  //       }}
  //     ></input>
  //     <button
  //       onClick={() => {
  //         navigate(`/${userName}`);
  //       }}
  //     >
  //       click
  //     </button>
  //   </>
  // );
};

export default App;
