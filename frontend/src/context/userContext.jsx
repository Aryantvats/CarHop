import React, { createContext, useState } from 'react'

export const UserDataProvider = createContext()

const UserContext = ({children}) => {

    const [user , setUser] =useState({
        fullName:{
            firstName: '',
            lastName: ''
        },
        email: '',
        password: ''
    })

  return (
    <div>
        <UserDataProvider.Provider value={{user , setUser}}>
        {children}
        </UserDataProvider.Provider>
    </div>
  )
}

export default UserContext;
