import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    getCurrentUserData
} from "../../store/users";

const NavProfile = () => {
    const refBody = useRef(document.body);

    const currentUser = useSelector(getCurrentUserData());
    const [isOpen, setOpen] = useState(false);
    const toggleMenu = () => {
        setOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const handleClickOnBody = (event) => {
            if (!event.target.closest("#profileMenu")) {
                setOpen(prevState => {
                    if (prevState) {
                        toggleMenu();
                        // console.log(event.target.closest("#profileMenu"), "Ближайший элемент меню профиля не найден");
                    }
                    return prevState;
                });
            }
        };

        if (refBody.current) {
          refBody.current.addEventListener("click", handleClickOnBody);
        }
        return () => {
            if (refBody.current) {
               refBody.current.removeEventListener("click", handleClickOnBody);
            }
        };
    }, []);

    if (!currentUser) return "Загрузка...";
    return (
        <div id="profileMenu" className="dropdown" onClick={toggleMenu}>
            <div className="btn dropdown-toggle d-flex align-items-center">
                <div className="me-2">{currentUser.name}</div>
                <img
                    src={currentUser.image}
                    alt=""
                    height="40"
                    className="img-responsive rounded-circle"
                />
            </div>
            <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
                <Link
                    to={`/users/${currentUser._id}`}
                    className="dropdown-item"
                >
                    Профиль
                </Link>
                <Link to="/logout" className="dropdown-item">
                    Выйти
                </Link>
            </div>
        </div>
    );
};

export default NavProfile;
