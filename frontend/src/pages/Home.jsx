import React, { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  {UserDataProvider}  from "../context/userContext";
import {SocketContext}  from "../context/socketContext";

const Home = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const {user} = useContext(UserDataProvider);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
  socket.emit("join",{
    userId:user._id,
    userType:'user'
  })
}, [user]);

  socket.on("ride-confirmed", (data) => {
    setRide(data);
    setWaitingForDriver(true);
  });

  socket.on("ride-started", (data) => {
    setWaitingForDriver(false);
    navigate("/riding",{state:{ride}})
  })

  socket.on("ride-finished", (data) => {
    navigate("/home")
  })

  const panelRef = useRef(null);
  const closepanel = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState({
    car: 0,
    moto: 0,
    auto: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(closepanel.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(closepanel.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriver]);

  const handleOriginChange = async (e) => {
    setOrigin(e.target.value);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOriginSuggestions(response.data);
    } catch {
      throw new Error("Unable to fetch suggestions");
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (err) {
      throw new Error("Unable to fetch suggestions");
    }
  };

  const createRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ride/create`,
      {
        origin,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };
 
  const findTrip = async () => {
    setVehiclePanel(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/ride/get-fare`,
      {
        params: { origin, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setFare(response.data);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-screen absolute top-0 flex flex-col justify-end w-full">
        <div className="h-[35%] relative bg-white p-5">
          <div className="line w-1 h-16 absolute top-[40%] left-10 bg-gray-700 rounded-full"></div>
          <h5
            ref={closepanel}
            className="opacity-0"
            onClick={() => {
              setPanelOpen(false);
            }}
          >
            <i className="ri-arrow-down-wide-line absolute top-6 text-2xl right-6"></i>
          </h5>
          <h4 className="text-3xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("origin");
              }}
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg mt-5 w-full"
              type="text"
              placeholder="Add a pick-up location"
              value={origin}
              onChange={handleOriginChange}
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg mt-3 w-full"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={handleDestinationChange}
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="h-0 bg-white">
          <LocationSearchPanel
            suggestions={
              activeField === "origin"
                ? originSuggestions
                : destinationSuggestions
            }
            setOrigin={setOrigin}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          fare={fare}
          setVehicleType={setVehicleType}
          setVehiclePanel={setVehiclePanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmedRide
          createRide={createRide}
          origin={origin}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          origin={origin}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver}
        ride={ride}
        />
      </div>
    </div>
  );
};

export default Home;
