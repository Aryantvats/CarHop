import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserLogout = ({children}) => {
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    axios.get(`${import.meta.env.VITE_BASR_URL}/user/logout`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status==200){
        localStorage.removeItem('token')
        navigate('/login')}
    })

  return (
    <div>
      LoggedOut
    </div>
  )
}

export default UserLogout
