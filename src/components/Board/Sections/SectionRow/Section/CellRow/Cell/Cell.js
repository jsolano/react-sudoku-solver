import React, { useState } from 'react'; 
import './style.css';

const cell = (props) => {
    const cellValue = props.cell.value === '.' ? '\u00A0' : props.cell.value;
    return (
        <div className={props.class} key={props.cell.key}>
            <div className="cell-value">{cellValue}</div>
        </div> 
    )    
}

export default cell;