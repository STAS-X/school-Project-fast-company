import React from "react";
import useMockData from "../utils/mockData";

const Main = () => {
    const { error, initialize, progress, status } = useMockData();
    const handleClick = () => {
        initialize();
    };
    return (
        <div className="container mt-5">
            <h1>Главная страница</h1>
            <h3>Инициализация данных в MongoDB</h3>
            <ul>
                <li>Status:{status}</li>
                <li>Progress: {progress}%</li>
                {error && <li>error: {error}</li>}
            </ul>
            <button className="btn btn-primary" onClick={handleClick}>
                {" "}
                Инициализировать
            </button>
        </div>
    );
};

export default Main;
