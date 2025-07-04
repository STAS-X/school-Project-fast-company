import React, { Children } from "react";
import chroma from "chroma-js";
import Select, { components } from "react-select";
import PropTypes from "prop-types";

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    const EMOJIS = ["👍", "😠", "👏", "👌", "🙌", "✌️", "❤️ ", "👐"];
    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.keys(options).map((optionName) => ({
                  label: options[optionName].name,
                  value: options[optionName]._id,
                  color: options[optionName].color
              }))
            : options;
    // console.log("Выбрали опцию", options);

    const handleChange = (value) => {
        onChange({ name, value });
    };
    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: "white" }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: isDisabled
                    ? undefined
                    : isSelected
                    ? data.color
                    : isFocused
                    ? color.alpha(0.2).css()
                    : undefined,
                color: isDisabled
                    ? "#ccc"
                    : isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : data.color,
                cursor: isDisabled ? "not-allowed" : "pointer",

                ":active": {
                    ...styles[":active"],
                    backgroundColor: !isDisabled
                        ? isSelected
                            ? color
                            : color.alpha(0.3).css()
                        : undefined
                }
            };
        },
        multiValue: (styles, { data }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: color.alpha(0.3).css()
            };
        },
        multiValueLabel: (styles, { data }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                color: color
            };
        },
        multiValueRemove: (styles, { data }) => {
            const bgColor = chroma(data.color);
            const color = chroma("#6610f2");
            return {
                ...styles,
                color: bgColor,
                ":hover": {
                    backgroundColor: bgColor.alpha(0.5).css(),
                    color: color.alpha(0.8).css()
                }
            };
        }
    };

    const MultiValueContainer = ({ children, ...props }) => {
         const arrayChildren = Children.toArray(children);
         // let enchanceElement;
         const newChildren = arrayChildren.map((child, index, arr) => {
            if (child.props.innerProps.className.search("label") > -1) {
                const enchanceElement = React.cloneElement(child, {
                                                                   ...props,
                                                                   children: `\u00A0${props.data.label}\u00A0${EMOJIS[optionsArray.findIndex((option) => option.value === props.data.value)]}\u00A0`
                                                                  });
                return enchanceElement;
            } else {
              return child;
            }
         }).map((child, index, arr) => { return arr[arr.length - index - 1]; });
        return (
            <components.MultiValueContainer {...props}>
                {newChildren}
            </components.MultiValueContainer>
        );
    };
    MultiValueContainer.propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    };

    const Option = ({ children, ...props }) => {
        return <components.Option {...props}> ➕ {children}</components.Option>;
    };

    Option.propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    };

    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                closeMenuOnScroll={false}
                menuShouldScrollIntoView={true}
                defaultValue={defaultValue}
                options={optionsArray}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={colourStyles}
                components={{
                    MultiValueContainer,
                    Option
                }}
                onChange={handleChange}
                name={name}
            />
        </div>
    );
};
MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array
};

export default MultiSelectField;
