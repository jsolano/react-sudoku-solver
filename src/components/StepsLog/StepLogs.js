import React, { useState } from 'react';
import './style.css';
import LogsDetails from './LogsDetails/LogsDetails';

const stepsLog = (props) => {
	return (
		<div className={props.classes}>
			<div className="title">Solution Steps</div>
			<div className="intro">
				Here you can view the logical steps used to solve the board
			</div>
			<LogsDetails classes="log-details" stepsLog={props.stepsLog} />
		</div>
	);
};

export default stepsLog;
