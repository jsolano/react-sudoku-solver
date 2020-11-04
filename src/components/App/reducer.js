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
} from '../../services/Solver/utils';
import { parseGrid } from '../../services/Solver/solver';
import { resetLog } from '../../services/Solver/logs';

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
				newBoardModalError: '',
				newBoardString: '',
				newBoard: true,
			};
		}
		case ACTIONS.CLOSE_LOAD: {
			return {
				...state,
				newBoard: false,
				newBoardString: '',
				newBoardModalError: '',
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
				solveBoardState: getBoardState(action.result.board),
				solutionSteps: action.result.solutionSteps,
				initialParsedBoard: parseGrid(state.currentBoardString),
				initialBoard: getBoardState(parseGrid(state.currentBoardString)),
			};
		}
		case ACTIONS.CHANGE: {
			const newBoardValues = parseGrid(state.newBoardString);
			return {
				...state,
				statusInitialBoard: isSolved(newBoardValues) ? STATUS.SOLVE : '',
				initialParsedBoard: newBoardValues,
				initialBoard: getBoardState(newBoardValues),
				currentBoardString: state.newBoardString,
				newBoardString: '',
			};
		}
		case ACTIONS.RANDOM: {
			const randomPuzzle = getRandomPuzzle();
			const newBoardValues = parseGrid(randomPuzzle);
			return {
				...state,
				statusInitialBoard: isSolved(newBoardValues) ? STATUS.SOLVE : '',
				initialParsedBoard: newBoardValues,
				initialBoard: getBoardState(newBoardValues),
				currentBoardString: randomPuzzle,
				newBoardString: '',
			};
		}
		case ACTIONS.RESET: {
			return {
				...state,
				solutionSteps: resetLog('solutionSteps'),
				solveBoardState: getBoardState(parseGrid(emptySudokuString)),
				newBoard: false,
				statusSolveBoard: STATUS.UNKNOWN,
				abortSolveBoard: STATUS.UNKNOWN,
				statusInitialBoard: STATUS.UNKNOWN,
				timerSolveBoard: STATUS.UNKNOWN,
				timeElapsed: 0,
				newBoardModalError: '',
			};
		}
		case ACTIONS.CLEAR: {
			const currentBoard = parseGrid(state.currentBoardString);
			return {
				...state,
				initialParsedBoard: currentBoard,
				initialBoard: getBoardState(currentBoard),
			};
		}
		case ACTIONS.USE_DEFAULT: {
			const defaultBoard = parseGrid(initialSudokuString);
			return {
				...state,
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

export const initialState = {
	currentBoardString: initialSudokuString,
	initialParsedBoard: parseGrid(initialSudokuString),
	isSolvingBoard: false,
	initialBoard: getBoardState(parseGrid(initialSudokuString)),
	solveBoardState: getBoardState(parseGrid(emptySudokuString)),
	solutionSteps: '',
	statusSolveBoard: STATUS.UNKNOWN,
	statusInitialBoard: STATUS.UNKNOWN,
	newBoardString: '',
	timerSolveBoard: STATUS.UNKNOWN,
	timeElapsed: 0,
	newBoard: false,
	abortSolveBoard: false,
	newBoardModalError: '',
};
