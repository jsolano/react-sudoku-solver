import React, { useState } from 'react';
import './style.css';
import CheckCircle from '../Icons/CheckCircle/CheckCircle';
import XCircle from '../Icons/XCircle/XCircle';
import AlertTriangle from '../Icons/AlertTriangle/AlertTriangle';
import Info from '../Icons/Info/Info';
import StopWatch from '../Icons/Stopwatch/Stopwatch';
import { STATUS } from '../../services/Solver/constants';

const statusMessage = (props) => {
	switch (props.status) {
		case STATUS.VALID: {
			return (
				<div className={props.classes}>
					<CheckCircle classes="App-icon solved-board" />
					<h5 className="App-status-message">This Board is Valid</h5>
				</div>
			);
		}
		case STATUS.INVALID: {
			return (
				<div className={props.classes}>
					<XCircle classes="App-icon unsolved-board" />
					<h5 className="App-status-message">This Board is unsolved</h5>
				</div>
			);
		}
		case STATUS.ABORT: {
			return (
				<div className={props.classes}>
					<AlertTriangle classes="App-icon abort-board" />
					<h4 className="App-status-abort-message">
						The processing is taking more time than expected and maybe cannot be
						solved with the current version. Please try another board.
					</h4>
				</div>
			);
		}
		case STATUS.TIMER: {
			return (
				<div className={props.classes}>
					<StopWatch classes="App-icon timer-solve" />
					<h5 className="App-status-message">
						Time elapsed: {props.timeElapsed} ms
					</h5>
				</div>
			);
		}
		case STATUS.SOLVE: {
			return (
				<div>
					<div className={props.classes}>
						<CheckCircle classes="App-icon solved-board" />
						<h5 className="App-status-message">This Board is Valid</h5>
					</div>
					<div className={props.classes}>
						<Info classes="App-icon info" />
						<h4 className="App-status-abort-message">
							After parsing the initial board and looking for possible values
							for every cell, the puzzle is solved. So, there's not too much to
							do here.
						</h4>
					</div>
				</div>
			);
		}
		default: {
			return <div></div>;
		}
	}
};

export default statusMessage;
