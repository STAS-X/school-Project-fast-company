import { useEffect, useMemo } from "react";
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
    const memoError = useMemo(() => authError, [authError]);

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
        if (memoError && memoError.type === "expires") {
            toastDarkBounce(memoError.message);
            setTimeout(() => {
                dispatch(logOut());
            }, 1500);
            return "need reauthorization";
        }
    }, [memoError]);

    if (usersStatusLoading) return "Loading";
    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
export default AppLoader;
