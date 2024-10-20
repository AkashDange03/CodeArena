import React, { useState,useContext } from 'react'
import { createContext } from 'react'

//created context 
const userContext = createContext()

//user define hook to accecc context values
export const useGlobalContext= () => useContext(userContext);


//created provider and any child that is wrapped around this component will have access to values
function GlobalContext({ children }) {
    const [userName, setUserName] = useState("");
    const [language,setLanguage] = useState("js");
    return (
        <userContext.Provider value={{ userName, setUserName,language,setLanguage }}>{children}</userContext.Provider>
    )
}

export default GlobalContext