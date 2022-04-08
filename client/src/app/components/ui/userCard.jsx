import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    getCurrentUserData,
    getUserById,
    updateUserData
} from "../../store/users";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [rateDirection, setDirectionRate] = useState();
    const { rate } = useSelector(getUserById(user._id));
    const currentUser = useSelector(getCurrentUserData());

    const updateCaretUpClass = useMemo(
        () =>
            rateDirection === "inc"
                ? `bi bi-caret-up-fill text-${
                      currentUser._id !== user._id ? "primary" : "secondary"
                  }`
                : "bi bi-caret-up text-secondary",
        [rateDirection]
    );

    useEffect(() => setDirectionRate("dec"), []);

    const updateCaretDownClass = useMemo(() => {
        return rateDirection === "dec"
            ? `bi bi-caret-down-fill text-${
                  currentUser._id !== user._id ? "primary" : "secondary"
              }`
            : "bi bi-caret-down text-secondary";
    }, [rateDirection]);

    const handleClick = () => {
        history.push(history.location.pathname + "/edit");
    };
    const handleIncrementRate = () => {
        if (currentUser._id !== user._id) {
            setDirectionRate("inc");
            dispatch(
                updateUserData({
                    _id: user._id,
                    type: "rate",
                    rateDirection: "inc"
                })
            );
        }
    };

    const handleDecrementRate = () => {
        if (currentUser._id !== user._id) {
            setDirectionRate("dec");
            dispatch(
                updateUserData({
                    _id: user._id,
                    type: "rate",
                    rateDirection: "dec"
                })
            );
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                {currentUser._id === user._id && (
                    <button
                        className="position-absolute top-0 end-0 btn btn-light btn-sm"
                        onClick={handleClick}
                    >
                        <i className="bi bi-gear"></i>
                    </button>
                )}

                <div className="d-flex flex-column align-items-center text-center position-relative">
                    <img
                        src={user.image}
                        className="rounded-circle"
                        width="150"
                    />
                    <div className="mt-3">
                        <h4>{user.name}</h4>
                        <p className="text-secondary mb-1">
                            {user.profession.name}
                        </p>
                        <div className="text-muted">
                            <i
                                className={updateCaretDownClass}
                                role="button"
                                onClick={handleDecrementRate}
                            ></i>
                            <i
                                className={updateCaretUpClass}
                                role="button"
                                onClick={handleIncrementRate}
                            ></i>
                            <span className="ms-2">{rate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
UserCard.propTypes = {
    user: PropTypes.object
};

export default UserCard;
