import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataProvider } from "../context/captainContext";

const CaptainLogin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataProvider)
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData={
      email,
      password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`, captainData);

    if(response.status==200){
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setemail("");
    setpassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <form action="" onSubmit={(e) => submitHandler(e)}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            name=""
            id=""
            placeholder="example@gmail.com"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full placeholder:text-base text-lg"
            required
            type="password"
            name=""
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            id=""
            placeholder="Password"
          />
          <button
            className="bg-[#111] rounded px-4 py-2 w-full mb-2 placeholder:text-base text-[#fff]"
            type="submit"
          >
            Login
          </button>

          <p className="text-center">
            Join a fleet?{" "}
            <Link to={"/captain-signup"} className="text-blue-600">
              Register as a Captain
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to={"/login"}
          className="flex justify-center items-center bg-[#d5622d] rounded px-4 py-2 w-full mb-7 placeholder:text-base text-[#fff]"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
