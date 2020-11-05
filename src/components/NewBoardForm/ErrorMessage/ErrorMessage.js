import React, { useState } from 'react';
import './style.css';
import { ERRORS } from './../../../services/Solver/constants';
import AlertTriangle from '../../Icons/AlertTriangle/AlertTriangle';

const errorMessage = (props) => {
	switch (props.error) {
		case ERRORS.INVALID_LENGTH: {
			return (
				<div className={props.classes}>
					<AlertTriangle classes="App-icon abort-board" />
					<h5 className="App-status-message">
						The string length must be equal to 81
					</h5>
				</div>
			);
		}
		case ERRORS.EMPTY_VALUE: {
			return (
				<div className={props.classes}>
					<AlertTriangle classes="App-icon abort-board" />
					<h4 className="App-status-abort-message">Enter a valid string</h4>
				</div>
			);
		}
		case ERRORS.INVALID_VALUE: {
			return (
				<div className={props.classes}>
					<AlertTriangle classes="App-icon abort-board" />
					<h4 className="App-status-abort-message">
						Valid values must be . and numbers in the range 1-9
					</h4>
				</div>
			);
		}
		default: {
			return <div className={props.classes}></div>;
		}
	}
};

export default errorMessage;
