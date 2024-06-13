import axios from "axios";

export const executeCode = async (sourceCode) => {
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: "js",
            version: "18.15.0",
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
        console.error("Error executing code:", error);
        throw error;
    }
};
