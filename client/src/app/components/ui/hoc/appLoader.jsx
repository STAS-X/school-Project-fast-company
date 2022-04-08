import { useEffect } from "react";
import { toastDarkBounce } from "../../../utils/animateTostify";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
    getIsLoggedIn,
    getErrors,
    loadUsersList,
    getUsersLoadingStatus,
    logOut
} from "../../../store/users";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessionsList } from "../../../store/professions";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn());
    const usersStatusLoading = useSelector(getUsersLoadingStatus());
    const authError = useSelector(getErrors());

    useEffect(() => {
        dispatch(loadQualitiesList());
        dispatch(loadProfessionsList());
        if (isLoggedIn) {
            dispatch(loadUsersList());
        }
        return () => {
            // console.log("unmount");
        };
    }, [isLoggedIn]);

    useEffect(() => {
        if (authError && authError.type === "expires") {
            toastDarkBounce(authError.message);
            dispatch(logOut());
            return "need reauthorization";
        }
    }, [authError]);

    if (usersStatusLoading) return "loading";
    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
export default AppLoader;
