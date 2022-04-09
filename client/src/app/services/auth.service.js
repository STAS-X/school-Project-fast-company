// import axios from "axios";
// import configFile from "../config.json";
// import httpService from "./http.service";
import configFile from "../config.json";
import https from "https";
import axios from "axios";
import localStorageService from "./localStorage.service";

const httpsAgent = new https.Agent({
    keepAlive: true,
    requestCert: false,
    rejectUnauthorized: false
});

const httpAuth = axios.create({
    baseURL: `${
        configFile.isMongoBase
            ? process.env.NODE_ENV === "production"
                ? configFile.apiDataEndpointProd
                : configFile.apiDataEndpoint
            : configFile.apiEndpoint
    }auth/`,
    httpsAgent: httpsAgent
});

const authService = {
    register: async (payload) => {
        const { data } = await httpAuth.post(`signUp/`, payload);
        return data;
    },
    login: async (payload) => {
        const { data } = await httpAuth.post(`signInWithPassword/`, payload);
        return data;
    },
    refresh: async () => {
        const { data } = await httpAuth.post("token/", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
};
export default authService;
