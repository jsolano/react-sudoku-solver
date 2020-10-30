import React, { useState, useEffect } from 'react';
import logo from '../../assets/nextstack-logo.png';
import me from '../../assets/jp.png';
import Board from '../Board/Board';
import Button from '../Button/Button';
import Circle from '../Circle/Circle';
import StepsLog from '../StepsLog/StepLogs';
import Modal from '../../components/Modal/Modal';
import NewBoardForm from '../../components/NewBoardForm/NewBoardForm';
import StatusMessage from '../StatusMessage/StatusMessage';

import {
	STATUS,
	initialSudokuString,
	validStringRegExp,
	emptySudokuString,
} from '../../services/Solver/constants';

import SolveBoard, { parseGrid } from '../../services/Solver/solver';
import { resetLog } from '../../services/Solver/logs';
import {
	getBoardState,
	getRandomPuzzle,
	isSolved,
} from '../../services/Solver/utils';

import './style.css';

const app = (props) => {
	useEffect(() => {
		//console.log('app component here load');
	}, []);

	// Board Data
	const initialBoard = parseGrid(initialSudokuString);
	const emptyBoard = parseGrid(emptySudokuString);

	const [initialParsedBoardState, setInitialParsedBoardState] = useState(
		parseGrid(initialSudokuString)
	);

	const [isSolvingBoard, setIsSolvingBoard] = React.useState(false);

	const [initialBoardState, setInitialBoardState] = useState(
		getBoardState(initialBoard, ' Initial ')
	);

	const [solveBoardState, setSolveBoardState] = useState(
		getBoardState(emptyBoard, ' Empty ')
	);

	const [spinnerSolveState, setSpinnerSolveState] = useState({
		status: 'show',
		msg: 'Solving...',
	});

	const [solutionStepsState, setSolutionStepsState] = useState();

	const [statusSolveBoardState, setStatusSolveState] = useState({
		status: STATUS.UNKNOWN,
	});

	const [statusInitialBoardState, setStatusInitialBoardState] = useState({
		status: STATUS.UNKNOWN,
	});

	const [newBoardStringState, setNewBoardStringState] = useState();

	const [currentBoardStringState, setCurrentBoardStringState] = useState(
		initialSudokuString
	);

	const [timerSolveBoardState, setTimerSolveState] = useState({
		status: STATUS.UNKNOWN,
		timeElapsed: 0,
	});

	const [newBoardState, setNewBoardState] = useState({ enterNewBoard: false });

	const [abortSolveBoardState, setAbortSolveBoardState] = useState(false);

	const [newBoardModalErrorState, setNewBoardModalErrorState] = useState();

	const isStringBoardValid = (entryString) => {
		if (!entryString) {
			setNewBoardModalErrorState('empty-value');
			return false;
		}

		if (!validStringRegExp.test(entryString)) {
			setNewBoardModalErrorState('invalid-value');
			return false;
		}

		if (entryString.length !== 81) {
			setNewBoardModalErrorState('invalid-length');
			return false;
		}

		return true;
	};

	const cleanUp = () => {
		setSolutionStepsState(resetLog('solutionSteps'));
		setSolveBoardState(getBoardState(emptyBoard, ' Empty '));
		setNewBoardState({ enterNewBoard: false });
		setAbortSolveBoardState({ status: STATUS.UNKNOWN });
		setStatusSolveState({ status: STATUS.UNKNOWN });
		setStatusInitialBoardState({ status: STATUS.UNKNOWN });
		setTimerSolveState({ status: STATUS.UNKNOWN, timeElapsed: 0 });
		setNewBoardModalErrorState('');
	};

	const onUseDefaultBoardHandler = () => {
		cleanUp();

		//Initial UI Board
		setInitialParsedBoardState(parseGrid(initialSudokuString));
		setInitialBoardState(getBoardState(initialBoard), ' Default ');
		setCurrentBoardStringState(initialSudokuString);
	};

	const onClearGameHandler = () => {
		cleanUp();

		setInitialParsedBoardState(parseGrid(currentBoardStringState));
		setInitialBoardState(
			getBoardState(parseGrid(currentBoardStringState)),
			' Default '
		);
	};

	const changeInitialBoardHandler = () => {
		if (isStringBoardValid(newBoardStringState)) {
			cleanUp();

			// Change Initial board
			const newBoardValues = parseGrid(newBoardStringState);
			if (isSolved(newBoardValues)) {
				setStatusInitialBoardState({ status: STATUS.SOLVE });
			}
			setInitialParsedBoardState(newBoardValues);
			setInitialBoardState(getBoardState(newBoardValues, ' New Board '));

			setCurrentBoardStringState(newBoardStringState);
			setNewBoardStringState('');
			console.log(' Its time to change initial board!');
		} else {
			console.log(' newBoardStringState is Empty!');
		}
	};

	const onLoadNewBoardHandler = () => {
		setNewBoardModalErrorState('');
		setNewBoardStringState('');
		setNewBoardState({ enterNewBoard: true });
	};

	const randomPuzzleHandler = () => {
		const randomPuzzle = getRandomPuzzle();

		cleanUp();

		// Change Initial board
		const newBoardValues = parseGrid(randomPuzzle);
		if (isSolved(newBoardValues)) {
			setStatusInitialBoardState({ status: STATUS.SOLVE });
		}
		setInitialParsedBoardState(newBoardValues);
		setInitialBoardState(getBoardState(newBoardValues, ' New Board '));

		setCurrentBoardStringState(randomPuzzle);
		setNewBoardStringState('');
	};

	const solveBoardHandler = () => {
		setIsSolvingBoard(true);
		SolveBoard(initialParsedBoardState).then((result) => {
			const timerSolverState = result.abort
				? { status: STATUS.UNKNOWN }
				: { status: STATUS.TIMER, timeElapsed: result.timer.toFixed(2) };

			setStatusSolveState({ status: result.status });
			setStatusInitialBoardState({ status: STATUS.UNKNOWN });
			setAbortSolveBoardState({
				status: result.abort ? STATUS.ABORT : STATUS.UNKNOWN,
			});
			setTimerSolveState(timerSolverState);

			setSolveBoardState(getBoardState(result.board, ' Solved '));
			setSolutionStepsState(result.solutionSteps);

			// Keep the same board
			setInitialParsedBoardState(parseGrid(currentBoardStringState));
			setInitialBoardState(
				getBoardState(parseGrid(currentBoardStringState), ' Same Board ')
			);

			setIsSolvingBoard(false);
		});
	};

	const onLearnClick = () => {
		console.log('onLearnClick  clicked!');
	};

	const closeModalHandler = () => {
		setNewBoardState({ enterNewBoard: false });
		setNewBoardStringState('');
		setNewBoardModalErrorState('');
	};

	const newInputBoardHandler = (event) => {
		setNewBoardStringState(event.target.value);
	};

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1 className="App-title">React Sudoku Solver</h1>
				<h3 className="App-author">J.P.</h3>
				<img src={me} className="App-author-image" alt="logo" />
			</header>

			<div className="App-body App-container">
				<div className="App-game-panel">
					<Circle classes="circle center-me" label="1" />
					<Button
						classes="btn marginTop15"
						click={onLoadNewBoardHandler}
						label="Load New Board"
					/>
					<Board
						classes="game-board"
						board={initialBoardState}
						name="initial"
					/>
					<div className="buttons-row">
						<Button
							classes="btn btn-small"
							click={onUseDefaultBoardHandler}
							label="Use Default Board"
						/>
					</div>
					<StatusMessage
						classes="App-message-row"
						status={statusInitialBoardState.status}
					/>
				</div>

				<div className="App-game-panel">
					<Circle classes="circle center-me" label="2" />
					<div>
						<Button
							classes="btn marginTop15"
							isSpinning={isSolvingBoard}
							click={solveBoardHandler}
							label="Solve"
						/>
					</div>

					<Board classes="game-board" board={solveBoardState} name="solver" />
					<div className="buttons-row">
						<Button
							classes="btn btn-small marginLeft10"
							click={onClearGameHandler}
							label="Clear"
						/>
					</div>
					<StatusMessage
						classes="App-message-row"
						status={timerSolveBoardState.status}
						timeElapsed={timerSolveBoardState.timeElapsed}
					/>
					<StatusMessage
						classes="App-message-row"
						status={statusSolveBoardState.status}
					/>
					<StatusMessage
						classes="App-message-row"
						status={abortSolveBoardState.status}
					/>
				</div>

				<div className="App-game-panel">
					<Circle classes="circle center-me" label="3" />
					<div className="buttons-row">
						<Button classes="btn" click={onLearnClick} label="Learn" />
					</div>
					<StepsLog classes="steps-log" stepsLog={solutionStepsState} />
				</div>
			</div>
			<Modal show={newBoardState.enterNewBoard} modalClosed={closeModalHandler}>
				<NewBoardForm
					modalClosed={closeModalHandler}
					changed={newInputBoardHandler}
					clicked={changeInitialBoardHandler}
					currentStringBoard={newBoardStringState}
					error={newBoardModalErrorState}
					randomPuzzle={randomPuzzleHandler}
				/>
			</Modal>
		</div>
	);
};

export default app;
