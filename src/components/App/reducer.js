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
		solutionSteps: resetLog('solutionSteps'),
		solveBoard: getBoardState(parseGrid(emptySudokuString)),
		newBoard: false,
		statusSolveBoard: STATUS.UNKNOWN,
		abortSolveBoard: STATUS.UNKNOWN,
		statusInitialBoard: STATUS.UNKNOWN,
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
				newBoard: true,
			};
		}
		case ACTIONS.CLOSE_LOAD: {
			return {
				...state,
				newBoard: false,
				newBoardString: '',
				modalError: '',
			};
		}
		case ACTIONS.SOLVE: {
			return {
				...state,
				isSolvingBoard: true,
			};
		}
		case ACTIONS.SUCCESS: {
			return {
				...state,
				isSolvingBoard: false,
				statusSolveBoard: action.result.status,
				statusInitialBoard: STATUS.UNKNOWN,
				abortSolveBoard: action.result.abort ? STATUS.ABORT : STATUS.UNKNOWN,
				timerSolveBoard: action.result.abort ? STATUS.ABORT : STATUS.TIMER,
				timeElapsed: action.result.timer.toFixed(2),
				solveBoard: getBoardState(action.result.board),
				solutionSteps: action.result.solutionSteps,
				initialParsedBoard: parseGrid(state.currentBoardString),
				initialBoard: getBoardState(parseGrid(state.currentBoardString)),
			};
		}
		case ACTIONS.CHANGE: {
			const isValidString = stringBoardValidation(state.newBoardString);
			if (isValidString === true) {
				const newBoardValues = parseGrid(state.newBoardString);
				return {
					...reset(state),
					statusInitialBoard: isSolved(newBoardValues) ? STATUS.SOLVE : '',
					initialParsedBoard: newBoardValues,
					initialBoard: getBoardState(newBoardValues),
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
				statusInitialBoard: isSolved(newBoardValues) ? STATUS.SOLVE : '',
				initialParsedBoard: newBoardValues,
				initialBoard: getBoardState(newBoardValues),
				currentBoardString: randomPuzzle,
				newBoardString: '',
			};
		}
		case ACTIONS.CLEAR: {
			const currentBoard = parseGrid(state.currentBoardString);
			return {
				...reset(state),
				initialParsedBoard: currentBoard,
				initialBoard: getBoardState(currentBoard),
			};
		}
		case ACTIONS.USE_DEFAULT: {
			const defaultBoard = parseGrid(initialSudokuString);
			return {
				...reset(state),
				initialParsedBoard: defaultBoard,
				initialBoard: getBoardState(defaultBoard),
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
	initialParsedBoard: parsedInitialBoard,
	isSolvingBoard: false,
	initialBoard: getBoardState(parsedInitialBoard),
	solveBoard: getBoardState(parseGrid(emptySudokuString)),
	solutionSteps: '',
	statusSolveBoard: STATUS.UNKNOWN,
	statusInitialBoard: STATUS.UNKNOWN,
	newBoardString: '',
	timerSolveBoard: STATUS.UNKNOWN,
	timeElapsed: 0,
	newBoard: false,
	abortSolveBoard: false,
	modalError: '',
};
