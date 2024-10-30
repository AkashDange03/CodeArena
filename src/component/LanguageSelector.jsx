import React from 'react'
import {languages} from "../helpers/langaugeApi.js"
import { useGlobalContext } from '../context/GlobalContext'
import { ACTIONS } from '../helpers/SocketActions.js';
function LanguageSelector({socketRef,roomId}) {
    const {Language,setLanguage} = useGlobalContext();
    // console.log(Language)

  const handleSelectChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);  // Update the context language
    //here i was passing Language directly so it was causing issue
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, language: newLanguage });  // Emit the new language
    console.log("Emitted language:", newLanguage);
  };


  return (
   <>
    <select id="language-select" value={Language} onChange={handleSelectChange} className=" w-20 text-sm font-thin my-2 text-black rounded-md md:py-2">
        <option value="" disabled>Select a language</option>
        {languages.map((language) => (
          <option key={language.name} value={language.name}>
            {language.name}
          </option>
        ))}
      </select>
   </>
  )
}

export default LanguageSelector