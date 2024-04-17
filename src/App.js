import "./App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  return (
    <>
      <input
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          navigate(`/${userName}`);
        }}
      >
        click
      </button>
    </>
  );
};

export default App;
