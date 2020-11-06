import React, { useEffect, useReducer } from 'react';
import Board from '../Board/Board';
import Button from '../Button/Button';
import Circle from '../Circle/Circle';
import StepsLog from '../StepsLog/StepLogs';
import Modal from '../../components/Modal/Modal';
import Header from '../Header/header';
import NewBoardForm from '../../components/NewBoardForm/NewBoardForm';
import StatusMessage from '../StatusMessage/StatusMessage';
import { ACTIONS } from '../../services/Solver/constants';
import Solver from '../../services/Solver/solver';
import { appReducer, initialState } from './reducer';
import './style.css';

const app = (props) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	const {
		isSolving,
		initialBoardParsed,
		initialBoardState,
		initialBoardStatus,
		solveBoardState,
		solveBoardStatus,
		solveBoardAbort,
		solutionSteps,
		newBoardString,
		timerSolveBoard,
		timeElapsed,
		openModal,
		modalError,
	} = state;

	useEffect(() => {
		const raw = localStorage.getItem('data');
		dispatch({ type: ACTIONS.RELOAD, payload: JSON.parse(raw) });
	}, []);

	useEffect(() => {
		localStorage.setItem('data', JSON.stringify(state));
	}, [state]);

	const solverHandler = () => {
		dispatch({ type: ACTIONS.SOLVE });

		Solver(initialBoardParsed).then((result) => {
			dispatch({ type: ACTIONS.SUCCESS, result: result });
		});
	};

	const onLearnClick = () => {
		console.log('onLearnClick  clicked!');
	};

	return (
		<div className="App">
			<Header />

			<div className="App-body App-container">
				<div className="App-game-panel">
					<Circle classes="circle center-me" label="1" />
					<Button
						classes="btn marginTop15"
						click={() => dispatch({ type: ACTIONS.OPEN })}
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
							click={() => dispatch({ type: ACTIONS.DEFAULT })}
							label="Use Default Board"
						/>
					</div>
					<StatusMessage
						classes="App-message-row"
						status={initialBoardStatus}
					/>
				</div>

				<div className="App-game-panel">
					<Circle classes="circle center-me" label="2" />
					<div>
						<Button
							classes="btn marginTop15"
							isSpinning={isSolving}
							click={solverHandler}
							label="Solve"
						/>
					</div>

					<Board classes="game-board" board={solveBoardState} name="solver" />
					<div className="buttons-row">
						<Button
							classes="btn btn-small marginLeft10"
							click={() => dispatch({ type: ACTIONS.CLEAR })}
							label="Clear"
						/>
					</div>
					<StatusMessage
						classes="App-message-row"
						status={timerSolveBoard}
						timeElapsed={timeElapsed}
					/>
					<StatusMessage classes="App-message-row" status={solveBoardStatus} />
					<StatusMessage classes="App-message-row" status={solveBoardAbort} />
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
				show={openModal}
				modalClosed={() => dispatch({ type: ACTIONS.CLOSE })}
			>
				<NewBoardForm
					modalClosed={() => dispatch({ type: ACTIONS.CLOSE })}
					changed={(e) =>
						dispatch({
							type: ACTIONS.SET,
							field: 'newBoardString',
							value: e.target.value,
						})
					}
					click={() => dispatch({ type: ACTIONS.CHANGE })}
					currentStringBoard={newBoardString}
					error={modalError}
					randomPuzzle={() => dispatch({ type: ACTIONS.RANDOM })}
				/>
			</Modal>
		</div>
	);
};

export default app;
