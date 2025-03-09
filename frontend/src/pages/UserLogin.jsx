import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  {UserDataProvider}  from "../context/userContext";

const UserLogin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataProvider);

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (response.status == 200) {
      const data = response.data;
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/home");
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
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
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
            New here?{" "}
            <Link to={"/signup"} className="text-blue-600">
              Create new Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to={"/captain-login"}
          className="flex justify-center items-center bg-[#10b461] rounded px-4 py-2 w-full mb-7 placeholder:text-base text-[#fff]"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
