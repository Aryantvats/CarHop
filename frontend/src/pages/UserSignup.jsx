import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {UserDataProvider} from "../context/userContext";

const UserSignup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const navigate = useNavigate();

  const {user, setUser} = useContext(UserDataProvider)

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser={
      email,
      fullName: {
        firstName,
        lastName,
      },
      password,
    };    

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser) 

    if(response.status == 201){
      const data=response.data;
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate('/home')
    }

    setemail("");
    setfirstName("");
    setlastName("");
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
        <form onSubmit={(e) => {submitHandler(e)}}>
          <h3 className="text-base font-medium mb-2">What's your name</h3>
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setfirstName(e.target.value);
              }}
              required
            />
            <input
              type="text"
              className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setlastName(e.target.value);
              }}
              required
            />
          </div>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
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
          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full placeholder:text-sm text-base"
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
            Register
          </button>

          <p className="text-center">
            Already have an Account?{" "}
            <Link to={"/login"} className="text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number provider.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
