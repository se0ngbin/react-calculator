import "./Frame.css";
import React from "react";

const Frame = ({ children }) => {
    return <div className="frame">{children}</div>;
};

export default Frame;