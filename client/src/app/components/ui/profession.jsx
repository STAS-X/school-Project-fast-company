import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    getProfessionbyId,
    getProfessionsLoadingStatus
} from "../../store/professions";

const Profession = ({ id }) => {
    const isLoading = useSelector(getProfessionsLoadingStatus());
    const prof = useSelector(getProfessionbyId(id));
    // console.log(prof, id, isLoading);
    if (!isLoading) {
        return <>{prof.name}</>;
    } else return "Загружается ...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
