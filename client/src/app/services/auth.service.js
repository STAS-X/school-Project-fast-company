// import axios from "axios";
// import configFile from "../config.json";
// import httpService from "./http.service";
import configFile from "../config.json";
import axios from "axios";
import localStorageService from "./localStorage.service";

const httpAuth = axios.create({
    baseURL: `${(configFile.isMongoBase
        ? configFile.apiDataEndpoint
        : configFile.apiEndpoint)}auth/`
});

const authService = {
    register: async ({ email, password }) => {
        const { data } = await httpAuth.post(`signUp/`, {
            email,
            password
        });
        return data;
    },
    login: async ({ email, password }) => {
        const { data } = await httpAuth.post(`signInWithPassword/`, {
            email,
            password
        });
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
