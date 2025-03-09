import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {

  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  axios.get(`${import.meta.env.VITE_BASR_URL}/captain/logout`,{
      headers: {
          Authorization: `Bearer ${token}`
      }
  }).then((response) => {
      if(response.status==200){
      localStorage.removeItem('token')
      navigate('/captain-login')}
  })


  return (
    <div>
      Captain Logout
    </div>
  )
}

export default CaptainLogout
