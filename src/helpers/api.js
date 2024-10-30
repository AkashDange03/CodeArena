import axios from "axios";
import { languages } from "./langaugeApi.js";

export const executeCode = async (sourceCode,Language) => {
    console.log(Language);
    const selectedLang = languages.find(lang => lang.name === Language);
    console.log(selectedLang)

    console.log(sourceCode)
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: selectedLang.name,
            version: selectedLang.version,
            files: [
                {
                    content: sourceCode
                }
            ]
        }, { headers: {
            'Content-Type': 'application/json'
        }});
        return response.data;
    } catch (error) {
        console.error(`%c Error executing code: ${error}`,"color:red");
        throw error;
    }
};
