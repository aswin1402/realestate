import React, { createContext, useState } from 'react'
export const LoginResponseContext= createContext();
export const propertyUpdateResponseContext=createContext()

const ResponseContex = ({children}) => {
    const [LoginResponse,setLoginResponse]=useState('');
    const [propertyUpdateResponse,setPropertyUpdateResponse]=useState('')
  return (
    <propertyUpdateResponseContext.Provider value={{propertyUpdateResponse,setPropertyUpdateResponse}}>
    <LoginResponseContext.Provider value={{LoginResponse,setLoginResponse}}>
               {children}  
           </LoginResponseContext.Provider>
           </propertyUpdateResponseContext.Provider>
  )
}

export default ResponseContex
