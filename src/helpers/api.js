import axios from "axios";

export const executeCode = async (sourceCode) => {
    console.log(sourceCode)
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: "java",
            version: "15.0.2",
            files: [
                {
                    name: "Main.java",
                    content: sourceCode
                }
            ]
        }, { headers: {
            'Content-Type': 'application/json'
        }});
        return response.data;
    } catch (error) {
        console.error(`%c Error executing corde: ${error}`,"color:red");
        throw error;
    }
};
