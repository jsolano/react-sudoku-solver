import React from 'react';
import './style.css';
import SolutionStep from './SolutionStep/SolutionStep';

const logsDetails = (props) => {
	if (props.stepsLog) {
		return props.stepsLog.map((stepRow, stepIndex) => {
			return (
				<div className="log-detail-row" key={'logsDetails-' + stepIndex + 1}>
					<SolutionStep
						solutionStepNumber={stepIndex + 1}
						solutionStep={stepRow}
					/>
				</div>
			);
		});
	} else {
		return <div className="log-detail-row"></div>;
	}
};

export default logsDetails;
