import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {UserDataProvider} from "../context/userContext";

const UserProtectorWrapper = ({ children }) => {
  const { user, setUser } = useContext(UserDataProvider);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    useEffect(() => navigate("/login"));
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);          
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  return <div>{children}</div>;
};

export default UserProtectorWrapper;
