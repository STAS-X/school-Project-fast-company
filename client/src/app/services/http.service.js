import axios from "axios";
// import { toast } from "react-toastify";
import { toastDarkBounce } from "../utils/animateTostify";
import configFile from "../config.json";
import authService from "./auth.service";

import localStorageService from "./localStorage.service";

const http = axios.create({
    baseURL: configFile.isMongoBase
        ? configFile.apiDataEndpoint
        : configFile.apiEndpoint
});

http.interceptors.request.use(
    async function (config) {
        if (configFile.isMongoBase) {
            // const containSlash = /\/$/gi.test(config.url);
            // config.url =
            //     (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
            const expiresDate = localStorageService.getTokenExpiresDate();
            const refreshToken = localStorageService.getRefreshToken();
            if (refreshToken && expiresDate < Date.now()) {
                const data = await authService.refresh();

                localStorageService.setTokens({
                    refreshToken: data.refreshToken,
                    accessToken: data.accessToken,
                    expiresIn: data.expiresIn,
                    userId: data.userId
                });
            }
            const accessToken = localStorageService.getAccessToken();
            if (accessToken) {
                config.params = { ...config.params, auth: accessToken };
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
function transormData(data) {
    return data && !data._id
        ? Object.keys(data).map((key) => ({
              ...data[key]
          }))
        : data;
}
http.interceptors.response.use(
    (res) => {
        if (configFile.isMongoBase) {
            res.data = { content: transormData(res.data) };
        }
        return res;
    },
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            console.log(error);
            toastDarkBounce(
                `При запросе данных произошла ошибка: ${error.message}`
            );
        }
        return Promise.reject(error);
    }
);
const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};
export default httpService;
