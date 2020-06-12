import axios from "axios";

const API = axios.create({
    baseURL: "http://10.0.2.2:3001",
});

export default API;
