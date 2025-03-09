import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataProvider } from "../context/captainContext";

const CaptainSignup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [vehicleType, setVehicleType] = useState("");

  const {captain, setCaptain} = useContext(CaptainDataProvider);

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptain ={
      email,
      fullName: {
        firstName,
        lastName,
      },
      password,
      vehicle: {
        color,
        plate,
        capacity:capacity,
        vehicleType
      }
    };    

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/register`, newCaptain)    

    if(response.status==201){
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token",data.token);
      navigate('/captain-home');

    }

    setemail("");
    setfirstName("");
    setlastName("");
    setpassword("");
    setCapacity(0);
    setColor("");
    setPlate("");
    setVehicleType("");
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
          <h3 className="text-base font-medium mb-2">What's our Captain's name</h3>
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
          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={color}
              onChange={(e) => {
                setColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={plate}
              onChange={(e) => {
                setPlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">car</option>
              <option value="auto">auto</option>
              <option value="moto">motorcycle</option>
            </select>
          </div>

          <button
            className="bg-[#111] rounded px-4 py-2 w-full mb-2 placeholder:text-base text-[#fff]"
            type="submit"
          >
            Register
          </button>

          <p className="text-center">
            Already have an Account?{" "}
            <Link to={"/captain-login"} className="text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CaptainSignup;
