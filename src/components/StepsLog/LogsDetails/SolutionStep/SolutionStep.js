import React, { useState } from 'react';
import './style.css';

const solutionStep = (props) => {
	return (
		<div className={props.classes} key={props.solutionStepNumber}>
			<div className="title">
				Step {props.solutionStepNumber}: {props.solutionStep.method}
			</div>
			<div className="details">{props.solutionStep.msg}</div>
		</div>
	);
};

export default solutionStep;
