import React, { useState } from "react";
// import { useParams } from "react-router";
import TextAreaField from "../form/textAreaField";
import { validator } from "../../../utils/ validator";
import PropTypes from "prop-types";
// import { useSelector } from "react-redux";
// import { getCurrentUserData } from "../../../store/users";

const AddCommentForm = ({ onSubmit }) => {
    const [data, setData] = useState({ content: "" });
    const [errors, setErrors] = useState({});
    // const currentUser = useSelector(getCurrentUserData());
    // const { userId } = useParams();

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validatorConfog = {
        content: {
            isRequired: {
                message: "Сообщение не может быть пустым"
            }
        }
    };

    const validate = () => {
        const errors = validator(data, validatorConfog);

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const clearForm = () => {
        setData({ content: "" });
        setErrors({});
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        onSubmit(data);
        clearForm();
    };

    return (
        <div>
            <h3>Новый комментарий</h3>
            <form onSubmit={handleSubmit}>
                <TextAreaField
                    value={data.content}
                    onChange={handleChange}
                    name="content"
                    label="Сообщение"
                    error={errors.content}
                />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary">Опубликовать</button>
                </div>
            </form>
        </div>
    );
};
AddCommentForm.propTypes = {
    onSubmit: PropTypes.func
};

export default AddCommentForm;
