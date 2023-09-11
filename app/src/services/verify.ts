import axios from "axios"

async function checkKey(key: string) {
    try {
        const response = await axios.put(`http://localhost:3001/auth/verify/${key}`);
        return response.data
    } catch (error) {
        throw error;
    }
};

async function verify(code: string, access: string) {
    try {
        const response = await axios.post("http://localhost:3001/auth/verify", { code, access });
        return response.data;
    } catch (error) {
        throw error
    }
}

export { verify, checkKey }