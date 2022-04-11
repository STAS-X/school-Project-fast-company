import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import { generetaAuthError } from "../utils/generateAuthError";
// import { toastErrorBounce } from "../utils/animateTostify";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: false,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceved: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.error = null;
            state.auth = null;
            state.dataLoaded = false;
        },
        userUpdateSuccessed: (state, action) => {
            action.payload.rate = Number(action.payload.rate).toFixed(1);
            state.entities[
                state.entities.findIndex((u) => u._id === action.payload._id)
            ] = action.payload;
        },
        authRequested: (state) => {
            state.error = null;
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersRequested,
    usersReceved,
    usersRequestFailed,
    authRequestFailed,
    authRequestSuccess,
    userLoggedOut,
    userUpdateSuccessed
} = actions;

const authRequested = createAction("users/authRequested");
const userUpdateFailed = createAction("users/userUpdateFailed");
const userUpdateRequested = createAction("users/userUpdateRequested");

export const login =
    ({ payload, redirect }) =>
    async (dispatch) => {
        const { email, password, stayOn } = payload;
        dispatch(authRequested());
        try {
            const data = await authService.login({ email, password });
            localStorageService.setTokens({ ...data, stayOn });
            dispatch(authRequestSuccess({ userId: data.userId }));
            history.push(redirect);
        } catch (error) {
            const { code, message } = error.response.data;
            if (code === 400) {
                const errorMessage = generetaAuthError(message);
                dispatch(authRequestFailed({ message: errorMessage }));
            } else {
                dispatch(authRequestFailed(error.message));
            }
        }
    };

export const signUp = (payload) => async (dispatch) => {
    dispatch(authRequested());
    try {
        const data = await authService.register(payload);
        localStorageService.setTokens(data);
        dispatch(authRequestSuccess({ userId: data.userId }));
        history.push("/user");
    } catch (error) {
        dispatch(authRequestFailed(error.message));
    }
};
export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    if (history.location.pathname !== "/login") history.push("/login");
    history.go(0);
};

export const loadUsersList = () => async (dispatch, state) => {
    dispatch(usersRequested());
    try {
        const data = await userService.get();
        dispatch(usersReceved(data.content));
    } catch (error) {
        if (error.response?.data) {
            dispatch(usersRequestFailed(error.response.data));
        } else dispatch(usersRequestFailed(error.message));
    }
};
export const updateUser = (payload) => async (dispatch) => {
    dispatch(userUpdateRequested());
    try {
        const { content } = await userService.update(payload.user || payload);
        dispatch(userUpdateSuccessed(content));

        if (payload.redirect === undefined || payload.redirect) {
            history.push(`/users/${content._id}`);
        }
    } catch (error) {
        dispatch(userUpdateFailed(error.message));
    }
};

export const updateUserData = (payload) => (dispatch, state) => {
    const modifyUser = state().users.entities.find(
        (user) => user._id === payload._id
    );
    let { rate, bookmark } = modifyUser;

    switch (payload.type) {
        case "rate":
            if (payload.rateDirection === "inc") {
                rate = Number(rate) + 0.1;
                if (rate > 5) rate = 1;
            } else {
                rate = Number(rate) - 0.1;
                if (rate < 1) rate = 5.0;
            }
            rate = Number(rate).toFixed(1);
            break;
        case "bookmark":
            bookmark = !bookmark;
            break;
    }
    dispatch(
        updateUser({
            user: {
                ...modifyUser,
                rate,
                bookmark
            },
            redirect: false
        })
    );
    dispatch(
        userUpdateSuccessed({
            ...modifyUser,
            rate,
            bookmark
        })
    );
};

export const getUsersList = () => (state) => state.users.entities;
export const getCurrentUserData = () => (state) => {
    return state.users.entities
        ? state.users.entities.find((u) => u._id === state.users.auth.userId)
        : null;
};
export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((u) => u._id === userId);
    }
};

export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getErrors = () => (state) => state.users.error;
export const getAuthErrors = () => (state) =>
    state.users.error?.message || state.users.error;
export default usersReducer;
