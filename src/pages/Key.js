import React from "react";
import "./Key.css";


class Key extends React.Component {
    render() {
        return (
            <button className="key" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
};

export default Key;
