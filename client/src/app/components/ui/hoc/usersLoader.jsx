import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
    getDataStatus,
    getUsersLoadingStatus,
    loadUsersList
} from "../../../store/users";

const UsersLoader = ({ children }) => {
    const dataStatus = useSelector(getDataStatus());
    const loadingStatus = useSelector(getUsersLoadingStatus());

    const dispatch = useDispatch();
    if (!dataStatus) dispatch(loadUsersList());

    if (loadingStatus) return "Загружаемся...";
    return children;
};

UsersLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
export default UsersLoader;
