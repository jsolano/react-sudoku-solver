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
	return {
		...state,
		initialBoardStatus: STATUS.UNKNOWN,
		solveBoardStatus: STATUS.UNKNOWN,
		solveBoardAbort: STATUS.UNKNOWN,
		solutionSteps: resetLog('solutionSteps'),
		solveBoardState: getBoardState(parseGrid(emptySudokuString)),
		openModal: false,
		timerSolveBoard: STATUS.UNKNOWN,
		timeElapsed: 0,
		modalError: '',
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
		case ACTIONS.OPEN_LOAD: {
			return {
				...state,
				modalError: '',
				newBoardString: '',
				openModal: true,
			};
		}
		case ACTIONS.CLOSE_LOAD: {
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
			return {
				...state,
				isSolving: false,
				solveBoardStatus: action.result.status,
				initialBoardStatus: STATUS.UNKNOWN,
				solveBoardAbort: action.result.abort ? STATUS.ABORT : STATUS.UNKNOWN,
				timerSolveBoard: action.result.abort ? STATUS.ABORT : STATUS.TIMER,
				timeElapsed: action.result.timer.toFixed(2),
				solveBoardState: getBoardState(action.result.board),
				solutionSteps: action.result.solutionSteps,
				initialBoardParsed: parseGrid(state.currentBoardString),
				initialBoardState: getBoardState(parseGrid(state.currentBoardString)),
			};
		}
		case ACTIONS.CHANGE: {
			const isValidString = stringBoardValidation(state.newBoardString);
			if (isValidString === true) {
				const newBoardValues = parseGrid(state.newBoardString);
				return {
					...reset(state),
					initialBoardStatus: isSolved(newBoardValues) ? STATUS.SOLVE : '',
					initialBoardParsed: newBoardValues,
					initialBoardState: getBoardState(newBoardValues),
					currentBoardString: state.newBoardString,
					newBoardString: '',
				};
			} else {
				return {
					...state,
					['modalError']: isValidString,
				};
			}
		}
		case ACTIONS.RANDOM: {
			const randomPuzzle = getRandomPuzzle();
			const newBoardValues = parseGrid(randomPuzzle);
			return {
				...reset(state),
				initialBoardStatus: isSolved(newBoardValues) ? STATUS.SOLVE : '',
				initialBoardParsed: newBoardValues,
				initialBoardState: getBoardState(newBoardValues),
				currentBoardString: randomPuzzle,
				newBoardString: '',
			};
		}
		case ACTIONS.CLEAR: {
			const currentBoardParsed = parseGrid(state.currentBoardString);
			return {
				...reset(state),
				initialBoardParsed: currentBoardParsed,
				initialBoardState: getBoardState(currentBoardParsed),
			};
		}
		case ACTIONS.USE_DEFAULT: {
			const defaultBoard = parseGrid(initialSudokuString);
			return {
				...reset(state),
				initialBoardParsed: defaultBoard,
				initialBoardState: getBoardState(defaultBoard),
				currentBoardString: initialSudokuString,
			};
		}
		default: {
			throw new Error(`Unhandled type: ${action.type}`);
		}
	}
};

const parsedInitialBoard = parseGrid(initialSudokuString);

export const initialState = {
	currentBoardString: initialSudokuString,
	initialBoardState: getBoardState(parsedInitialBoard),
	initialBoardStatus: STATUS.UNKNOWN,
	initialBoardParsed: parsedInitialBoard,
	solveBoardState: getBoardState(parseGrid(emptySudokuString)),
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
