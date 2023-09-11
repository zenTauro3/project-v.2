import axios from "../config/axios";

async function auth(token: string | undefined) {
    try {
        const response = await axios.get("/auth", { headers: { Authorization: token } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default auth;
