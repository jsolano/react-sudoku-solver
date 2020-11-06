import { digits, STATUS, STRATEGIES } from './constants';

import {
	all,
	copy,
	dict,
	isCompleted,
	getSquaresWithFewestCandidates,
	some,
	sectionList,
	squares,
	units,
	peers,
	log,
	hasPairValues,
	getPairSquares,
	unsolvedSquares,
	canEliminate,
	showBoardStatus,
	isSolved,
	display,
	getSquareUnitRowCol,
	getPeers,
} from './utils';

import {
	resetLog,
	startTimer,
	stopTimer,
	getLog,
	setSolverStrategy,
} from './logs';

////////////////////////////// Solving Strategies //////////////////////////////////////

/**
 * Backtracking Search with Constraint Propagation
 *
 * Javascript port of Peter Norvig's algorithm that Solve Every Sudoku Puzzle.
 * See http://norvig.com/sudoku.html for his article and explanations.
 * Also, many ideas came from @einaregilsson/sudoku JS solver
 *
 *  This approach systematically try all possibilities until it hit one that works,
 *  therefore has to be the last strategy to be applied.
 *
 *  First make sure we haven't already found a solution or a contradiction,
 *  and if not, choose one unfilled square and consider all its possible values.
 *  One at a time, try assigning the square each value, and searching from the
 *  resulting position. In other words, we search for a value d such that we can
 *  successfully search for a solution from the result of assigning square s to d
 *
 *  Constraint Propagation strategies:
 *     (1: Naked Single) If a square has only one possible value,
 *          then eliminate that value from the square's peers.
 *     (2: Hidden Single) If a unit has only one possible place for a value,
 *          then put the value there.
 *
 *  This strategy can't collect solutions steps are as there are many false
 *  positives attempts before it find the final solution.
 *
 */

export const search = (values) => {
	// Set a global flag to stop collecting solution steps
	setSolverStrategy(STRATEGIES.BACKTRACKING);

	// Failed earlier
	if (!values) return false;

	// Solved!
	if (isCompleted(values)) return values;

	// Chose the unfilled square with the fewest candidate possibilities
	const square = getSquaresWithFewestCandidates(values)[0];
	const digits = values[square].split('');

	// Using depth-first search and propagation, try all possible values.
	return some(digits, (digit) => search(assign(copy(values), square, digit)));
};

export const assign = (values, square, digit) => {
	// Eliminate all the other values (except digit) from values[square] and propagate.
	// Return values, except return false if a contradiction is detected.
	const otherValues = values[square].replace(digit, '').split('');
	const isAssigned = all(otherValues, (otherValue) =>
		eliminate(values, square, otherValue)
	);
	if (isAssigned) {
		return values;
	} else {
		return false;
	}
};

export const eliminate = (values, square, digit) => {
	//Eliminate digit from values[square]; propagate when values or places <= 2.
	//return values, except return false if a contradiction is detected.

	const isDigitPresent = values[square].indexOf(digit) !== -1;

	if (!isDigitPresent) {
		// already eliminated.
		return values;
	}

	values[square] = values[square].replace(digit, '');

	// (1) If a square is reduced to oneValue, then eliminate oneValue
	// from the peers.
	const possibleValues = values[square];
	const isSquareContradicted = possibleValues.length === 0;
	const isSquareSolved = possibleValues.length === 1;
	if (isSquareContradicted) {
		// Contradiction: removed last value
		return false;
	} else if (isSquareSolved) {
		// Propagate change
		const oneValue = possibleValues;
		const peersSquares = Object.keys(peers[square]);
		const isSafePropagated = all(peersSquares, (peerSquare) =>
			eliminate(values, peerSquare, oneValue)
		);
		if (isSafePropagated) {
			log(STRATEGIES.NAKED_SINGLE, [square], oneValue);
		} else {
			return false;
		}
	}

	//  (2) If a unit is reduced to only one place for a value digit, then put it there.
	for (const unit of units[square]) {
		const digitPlaces = unit.filter(
			(square) => values[square].indexOf(digit) !== -1
		);
		const areAnyPlaces = digitPlaces.length > 0;
		const isOnlyOnePlace = digitPlaces.length === 1;

		if (!areAnyPlaces) {
			// Contradiction: no place for this value
			return false;
		} else if (isOnlyOnePlace) {
			// digit can only be in one place in unit; assign it there
			if (assign(values, digitPlaces[0], digit)) {
				log(STRATEGIES.HIDDEN_SINGLE, [square], digit);
			} else {
				return false;
			}
		}
	}
	return values;
};

export const parseGrid = (grid) => {
	setSolverStrategy(STRATEGIES.BACKTRACKING);
	// Convert grid to a dict of possible values, {square: digits}, or
	// return False if a contradiction is detected.

	const values = dict(squares, digits);
	const input = gridValues(grid);

	for (const square in input) {
		const value = input[square];
		// square value could be '.' or 1..9
		const isAssignableValue =
			digits.indexOf(value) === -1 || assign(values, square, value);
		if (!isAssignableValue) {
			return false; // (Fail if we can't assign value to square.)
		}
	}

	return values;
};

const gridValues = (grid) => {
	//Convert grid into a dict of {square: char} with '0' or '.' for empties.
	const parseGrid = grid.replace(/[^0-9\.]/g, '');
	return dict(squares, parseGrid.split(''));
};

/************************** End Backtrack Search  ***********************************/

/**
 * Pointing Pairs with Constraint Propagation
 *
 * Looking at each unsolved unit in turn there may be two occurrences
 * of a particular digit. If these digits are aligned on a single row or column,
 * we can remove any digit occurs anywhere else on the row or column outside the unit
 *
 */
export const searchPointPair = async (values) => {
	setSolverStrategy(STRATEGIES.POINTING_PAIRS);

	// Failed earlier
	if (!values) return false;

	// Solved!
	if (isCompleted(values)) return values;

	for (const section of sectionList) {
		for (const square of unsolvedSquares(section, values)) {
			const digits = values[square].split('');
			if (!all(digits, (digit) => findPointPair(values, square, digit))) {
				return false;
			}
		}
	}
	return values;
};

export const findPointPair = (values, square, digit) => {
	const [unitCol, unitRow, unit] = units[square];
	const [unitRows, unitCols] = getSquareUnitRowCol(unit, square);
	const [rowPeers, colPeers, unitRowPeers, unitColPeers] = getPeers(
		unit,
		unitRow,
		unitRows,
		unitCol,
		unitCols,
		values
	);

	if (hasPairValues(unit, values, digit)) {
		if (hasPairValues(unitRows, values, digit)) {
			// aligned on a single row
			const areRowPeerValuesEliminated = eliminatePeerValues(
				rowPeers,
				values,
				digit
			);
			if (areRowPeerValuesEliminated) {
				const pairSquaresCol = getPairSquares(unitRows, values, digit);
				log(STRATEGIES.POINTING_PAIRS, pairSquaresCol, digit);
			}
		} else if (hasPairValues(unitCols, values, digit)) {
			// aligned on a single column
			const areColPeerValuesEliminated = eliminatePeerValues(
				colPeers,
				values,
				digit
			);
			if (areColPeerValuesEliminated) {
				const pairSquaresRow = getPairSquares(unitCols, values, digit);
				log(STRATEGIES.POINTING_PAIRS, pairSquaresRow, digit);
			}
		}
	} else if (
		hasPairValues(unitCols, values, digit) &&
		!canEliminate(colPeers, values, digit)
	) {
		const areUnitColPeerValuesEliminated = eliminatePeerValues(
			unitColPeers,
			values,
			digit
		);
		if (areUnitColPeerValuesEliminated) {
			const pairSquaresCol = getPairSquares(unitCols, values, digit);
			log(STRATEGIES.POINTING_PAIRS, pairSquaresCol, digit);
		}
	} else if (
		hasPairValues(unitRows, values, digit) &&
		!canEliminate(rowPeers, values, digit)
	) {
		const areUnitRowPeerValuesEliminated = eliminatePeerValues(
			unitRowPeers,
			values,
			digit
		);
		if (areUnitRowPeerValuesEliminated) {
			const pairSquaresRow = getPairSquares(unitRows, values, digit);
			log(STRATEGIES.POINTING_PAIRS, pairSquaresRow, digit);
		}
	}

	return values;
};

export const eliminatePeerValues = (peers, values, digit) =>
	canEliminate(peers, values, digit) &&
	all(peers, (sq) => eliminate(values, sq, digit));

/**************************** End Pointing Pairs  ***********************************/

/**
 * Async method to solve a sudoku board. Stop on potential
 * infinite loops after a certain number of iterations. It will return
 * a promise until the board is solved or aborted.
 * @param values - The parsed board to be solve.
 *  @returns a promise with the solveBoardResult with
 *  @field timer = timer in ms
 *  @field board = result board
 *  @field solved = 'valid' | 'invalid';
 *	@field abort = true | false;
 *	@field completed = true | false;
 *	@field solutionSteps = array of solutionSteps
 */
const Solver = async (values) => {
	let loopCounter = 0;
	const loopLimit = 5;
	let isAborted,
		stopLoop = false;

	let solved = isSolved(values);
	let completed = solved || isCompleted(values);

	const solveBoardResult = {
		timer: 0,
		board: values,
		status: solved ? STATUS.VALID : STATUS.INVALID,
		abort: isAborted,
		completed: completed,
		solutionSteps: [],
	};

	if (completed) return solveBoardResult;

	let analysisBoard = values;

	resetLog('solutionSteps');
	let solveTimer = startTimer();

	try {
		// Loop until the board is solved or completed or aborted.
		// This in case the board will be returned with a non valid state.
		while (!solved && !completed && !stopLoop) {
			// Start solving strategies
			analysisBoard = await searchPointPair(analysisBoard);
			// Add new solvers here, i.e:
			// analysisBoard = await searchHiddenPairsTriples(analysisBoard);
			// analysisBoard = await searchNakedHiddenQuads(analysisBoard);
			// analysisBoard = await searchBoxLineReduction(analysisBoard);
			// End solving strategies

			solved = isSolved(analysisBoard);
			completed = isCompleted(analysisBoard);

			loopCounter++;

			if (!solved && loopCounter >= loopLimit) {
				// if board is still unsolved, use backtrack search
				log(STRATEGIES.BACKTRACKING);
				analysisBoard = search(analysisBoard);
				solved = isSolved(analysisBoard);
				completed = isCompleted(analysisBoard);
				isAborted = !solved;
				stopLoop = true;
			}
		}

		solveBoardResult.board = analysisBoard;
		solveBoardResult.timer = stopTimer(solveTimer);
		solveBoardResult.status = solved ? STATUS.VALID : STATUS.INVALID;
		solveBoardResult.abort = isAborted;
		solveBoardResult.completed = completed;
		solveBoardResult.solutionSteps = getLog('solutionSteps');

		if (!solved) {
			console.log(display(analysisBoard));
		}

		return solveBoardResult;
	} catch (error) {
		return solveBoardResult;
		showBoardStatus(values, ' Debugger ');
		console.log('Error solver ', error);
	}
};

export default Solver;
