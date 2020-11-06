import React, { useRef, useEffect } from 'react';
import './style.css';
import Button from '../../components/Button/Button';
import ErrorMessage from './ErrorMessage/ErrorMessage';

const newBoardForm = (props) => {
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	});

	return (
		<div className="new-board">
			<h3>Enter a Sudoku string board</h3>
			<h5>
				<a className="pick-one" onClick={props.randomPuzzle}>
					or Just Pick One
				</a>
			</h5>
			<p>Valid strings could contain dots and numbers</p>
			<input
				ref={inputRef}
				className="board-text-input"
				type="text"
				onChange={props.changed}
				value={props.currentStringBoard || ''}
				placeholder="e.g.  4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
			/>
			<div className="action-row">
				<ErrorMessage classes="errors" error={props.error} />
				<div className="action-buttons marginTop15">
					<Button
						classes="btn btn-small btn-close marginLeft10"
						label="Close"
						click={props.modalClosed}
					/>
					<Button
						classes="btn btn-small marginLeft10"
						click={props.click}
						label="Ok"
					/>
				</div>
			</div>
		</div>
	);
};

export default newBoardForm;
