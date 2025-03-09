import React, { createContext, useState } from 'react'

export const CaptainDataProvider = createContext()

const CaptainContext = ({children}) => {

    const [captain, setCaptain]=useState({
        fullName:{
            firstName: '',
            lastName: ''
        },
        email: '',
        password: '',
        vehicle: {
            color: '',
            plate: '',
            capacity: 0,
            vehicleType: ''
        }
    })

  return (
    <CaptainDataProvider.Provider value={{captain, setCaptain }}>
      {children}
    </CaptainDataProvider.Provider>
  )
}

export default CaptainContext
