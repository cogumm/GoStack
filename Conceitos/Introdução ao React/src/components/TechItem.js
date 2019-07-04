import React from "react";
import PropTypes from "prop-types";

function TechItem({ tech, onDelete }) {
    return (
        <li>
            {tech}
            <button onClick={onDelete} type="button">
                Remover
            </button>
        </li>
    );
}

/*
 * Forma global de valor dafault
 */
TechItem.defaultProps = {
    tech: "Oculto"
};

TechItem.PropTypes = {
    tech: PropTypes.string,
    onDelete: PropTypes.func.isRequired
};

export default TechItem;
