import React, { useEffect, useReducer } from 'react';
import logo from '../../assets/nextstack-logo.png';
import me from '../../assets/jp.png';
import Board from '../Board/Board';
import Button from '../Button/Button';
import Circle from '../Circle/Circle';
import StepsLog from '../StepsLog/StepLogs';
import Modal from '../../components/Modal/Modal';
import NewBoardForm from '../../components/NewBoardForm/NewBoardForm';
import StatusMessage from '../StatusMessage/StatusMessage';

import { ACTIONS, validStringRegExp } from '../../services/Solver/constants';

import SolveBoard from '../../services/Solver/solver';

import './style.css';

import { appReducer, initialState } from './reducer';

const app = (props) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	const {
		initialParsedBoard,
		isSolvingBoard,
		initialBoard,
		solveBoardState,
		solutionSteps,
		newBoardString,
		timerSolveBoard,
		timeElapsed,
		newBoard,
		abortSolveBoard,
		statusSolveBoard,
		statusInitialBoard,
		newBoardModalError,
	} = state;

	useEffect(() => {
		const raw = localStorage.getItem('data');
		dispatch({ type: ACTIONS.RELOAD, payload: JSON.parse(raw) });
	}, []);

	useEffect(() => {
		localStorage.setItem('data', JSON.stringify(state));
	}, [state]);

	const isStringBoardValid = (entryString) => {
		if (!entryString) {
			dispatch({
				type: ACTIONS.SET,
				field: 'newBoardModalError',
				value: 'empty-value',
			});
			return false;
		}

		if (!validStringRegExp.test(entryString)) {
			dispatch({
				type: ACTIONS.SET,
				field: 'newBoardModalError',
				value: 'invalid-value',
			});
			return false;
		}

		if (entryString.length !== 81) {
			dispatch({
				type: ACTIONS.SET,
				field: 'newBoardModalError',
				value: 'invalid-length',
			});
			return false;
		}

		return true;
	};

	const onUseDefaultBoardHandler = () => {
		dispatch({ type: ACTIONS.RESET });
		dispatch({ type: ACTIONS.USE_DEFAULT });
	};

	const onClearGameHandler = () => {
		dispatch({ type: ACTIONS.RESET });
		dispatch({ type: ACTIONS.CLEAR });
	};

	const changeInitialBoardHandler = () => {
		if (isStringBoardValid(state.newBoardString)) {
			dispatch({ type: ACTIONS.RESET });
			dispatch({ type: ACTIONS.CHANGE });
		}
	};

	const randomPuzzleHandler = () => {
		dispatch({ type: ACTIONS.RESET });
		dispatch({ type: ACTIONS.RANDOM });
	};

	const solveBoardHandler = (e) => {
		e.preventDefault();

		dispatch({ type: ACTIONS.SOLVE });

		SolveBoard(initialParsedBoard).then((result) => {
			dispatch({ type: ACTIONS.SUCCESS, result: result });
		});
	};

	const onLearnClick = () => {
		console.log('onLearnClick  clicked!');
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
						click={() => dispatch({ type: ACTIONS.OPEN_LOAD })}
						label="Load New Board"
					/>
					<Board classes="game-board" board={initialBoard} name="initial" />
					<div className="buttons-row">
						<Button
							classes="btn btn-small"
							click={onUseDefaultBoardHandler}
							label="Use Default Board"
						/>
					</div>
					<StatusMessage
						classes="App-message-row"
						status={statusInitialBoard}
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
						status={timerSolveBoard}
						timeElapsed={timeElapsed}
					/>
					<StatusMessage classes="App-message-row" status={statusSolveBoard} />
					<StatusMessage classes="App-message-row" status={abortSolveBoard} />
				</div>

				<div className="App-game-panel">
					<Circle classes="circle center-me" label="3" />
					<div className="buttons-row">
						<Button classes="btn" click={onLearnClick} label="Learn" />
					</div>
					<StepsLog classes="steps-log" stepsLog={solutionSteps} />
				</div>
			</div>
			<Modal
				show={newBoard}
				modalClosed={() => dispatch({ type: ACTIONS.CLOSE_LOAD })}
			>
				<NewBoardForm
					modalClosed={() => dispatch({ type: ACTIONS.CLOSE_LOAD })}
					changed={(e) =>
						dispatch({
							type: ACTIONS.SET,
							field: 'newBoardString',
							value: e.target.value,
						})
					}
					clicked={changeInitialBoardHandler}
					currentStringBoard={newBoardString}
					error={newBoardModalError}
					randomPuzzle={randomPuzzleHandler}
				/>
			</Modal>
		</div>
	);
};

export default app;
