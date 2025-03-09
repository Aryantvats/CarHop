import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataProvider } from '../context/captainContext'

const CaptainProtectWrapper = ({children}) => {

    const {setCaptain} = useContext(CaptainDataProvider)
    const [isLoading, setIsLoading] = useState(true)
    const token = localStorage.getItem('token') 

    const navigate = useNavigate()

    if(!token) {
        useEffect(() =>{
            navigate('/captain-login')
        })
    }

    useEffect(()=>{
      axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`,{
        headers:{
          Authorization:  `Bearer ${token}`
        }}).then(response =>{
          if(response.status === 200){
            setCaptain(response.data)
            setIsLoading(false)
          }
          }).catch(() =>{
            localStorage.removeItem('token')
            navigate('/captain-login')
          })
        },[token])

        if(isLoading) {
          return <div>Loading...</div>
        }

  return (
    <div>
      {children}
    </div>
  )
}

export default CaptainProtectWrapper
