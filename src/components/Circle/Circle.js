import React from 'react'; 
import './style.css';

const circle = (props) => {
    return <div className={props.classes}>{props.label}</div>
}

export default circle;