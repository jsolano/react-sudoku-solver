import {
	STATUS,
	ACTIONS,
	initialSudokuString,
	emptySudokuString,
} from '../../services/Solver/constants';
import {
	getBoardState,
	getRandomPuzzle,
	isSolved,
	stringBoardValidation,
} from '../../services/Solver/utils';
import { parseGrid } from '../../services/Solver/solver';
import { resetLog } from '../../services/Solver/logs';

const reset = (state) => {
	const emptyBoardParsed = parseGrid(emptySudokuString);
	return {
		...state,
		initialBoardStatus: STATUS.UNKNOWN,
		solveBoardStatus: STATUS.UNKNOWN,
		solveBoardAbort: STATUS.UNKNOWN,
		solutionSteps: resetLog('solutionSteps'),
		solveBoardState: getBoardState(emptyBoardParsed),
		openModal: false,
		timerSolveBoard: STATUS.UNKNOWN,
		timeElapsed: 0,
		modalError: '',
	};
};

const change = (state, newBoardString) => {
	const newBoardParsed = parseGrid(newBoardString);
	return {
		...reset(state),
		initialBoardStatus: isSolved(newBoardParsed) ? STATUS.SOLVE : '',
		initialBoardParsed: newBoardParsed,
		initialBoardState: getBoardState(newBoardParsed),
		currentBoardString: newBoardString,
		newBoardString: '',
	};
};

export const appReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.RELOAD: {
			return action.payload;
		}
		case ACTIONS.SET: {
			return {
				...state,
				[action.field]: action.value,
			};
		}
		case ACTIONS.OPEN: {
			return {
				...state,
				modalError: '',
				newBoardString: '',
				openModal: true,
			};
		}
		case ACTIONS.CLOSE: {
			return {
				...state,
				openModal: false,
				newBoardString: '',
				modalError: '',
			};
		}
		case ACTIONS.SOLVE: {
			return {
				...state,
				isSolving: true,
			};
		}
		case ACTIONS.SUCCESS: {
			const initialBoardParsed = parseGrid(state.currentBoardString);
			const result = action.result;
			const resultBoardParsed = result.board;
			return {
				...state,
				isSolving: false,
				solveBoardStatus: result.status,
				initialBoardStatus: STATUS.UNKNOWN,
				solveBoardAbort: result.abort ? STATUS.ABORT : STATUS.UNKNOWN,
				timerSolveBoard: result.abort ? STATUS.ABORT : STATUS.TIMER,
				timeElapsed: result.timer.toFixed(2),
				solveBoardState: getBoardState(resultBoardParsed),
				solutionSteps: result.solutionSteps,
				initialBoardParsed: initialBoardParsed,
				initialBoardState: getBoardState(initialBoardParsed),
			};
		}
		case ACTIONS.CHANGE: {
			const isValidString = stringBoardValidation(state.newBoardString);
			if (isValidString === true) {
				return change(state, state.newBoardString);
			} else {
				const validationError = isValidString;
				return {
					...state,
					['modalError']: validationError,
				};
			}
		}
		case ACTIONS.RANDOM: {
			const randomPuzzleString = getRandomPuzzle();
			return change(state, randomPuzzleString);
		}
		case ACTIONS.CLEAR: {
			const initialBoardParsed = parseGrid(state.currentBoardString);
			return {
				...reset(state),
				initialBoardParsed: initialBoardParsed,
				initialBoardState: getBoardState(initialBoardParsed),
			};
		}
		case ACTIONS.DEFAULT: {
			const initialBoardParsed = parseGrid(initialSudokuString);
			return {
				...reset(state),
				initialBoardParsed: initialBoardParsed,
				initialBoardState: getBoardState(initialBoardParsed),
				currentBoardString: initialSudokuString,
			};
		}
		default: {
			throw new Error(`Unhandled type: ${action.type}`);
		}
	}
};

const initialBoardParsed = parseGrid(initialSudokuString);
const emptyBoardParsed = parseGrid(emptySudokuString);

export const initialState = {
	currentBoardString: initialSudokuString,
	initialBoardParsed: initialBoardParsed,
	initialBoardState: getBoardState(initialBoardParsed),
	initialBoardStatus: STATUS.UNKNOWN,
	solveBoardState: getBoardState(emptyBoardParsed),
	solveBoardStatus: STATUS.UNKNOWN,
	solveBoardAbort: false,
	isSolving: false,
	solutionSteps: [],
	newBoardString: '',
	timerSolveBoard: STATUS.UNKNOWN,
	timeElapsed: 0,
	openModal: false,
	modalError: '',
};
