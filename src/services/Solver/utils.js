import { addSolutionStepsLog } from './logs';
import {
	digits,
	rows,
	cols,
	rRows,
	cCols,
	STRATEGIES,
	ERRORS,
	STRING_BOARD_LENGTH,
	validStringRegExp,
} from './constants';
import { puzzles } from '../Solver/tests/data';

// Cross product of elements in A and elements in B.
export const cross = (listA, listB) => {
	const crossProduct = [];
	for (const a of listA) {
		for (const b of listB) {
			crossProduct.push(a + b);
		}
	}
	return crossProduct;
};

export const member = (item, list) => {
	for (const elem of list) {
		if (item === elem) {
			return true;
		}
	}
	return false;
};

export const Squares = () => {
	return cross(rows, cols);
};

export const squares = Squares();

export const SectionList = () => {
	const sectionList = [];
	for (const rs of rRows) {
		for (const cs of cCols) {
			sectionList.push(cross(rs, cs));
		}
	}
	return sectionList;
};

export const sectionList = SectionList();

export const UnitList = () => {
	return [
		...cols.map((col) => cross(rows, [col])),
		...rows.map((row) => cross([row], cols)),
		...sectionList,
	];
};

export const unitList = UnitList();

export const Units = () => {
	return squares.reduce((units, key) => {
		units[key] = unitList.filter((ul) => member(key, ul));
		return units;
	}, []);
};

export const units = Units();

export const Peers = () => {
	let peers = {};
	for (const square of squares) {
		peers[square] = {};
		for (const unit of units[square]) {
			for (const square2 of unit) {
				if (square2 !== square) {
					peers[square][square2] = true;
				}
			}
		}
	}
	return peers;
};

export const peers = Peers();

const getSectionUnits = (sectionNumber, values) => {
	let cellRows = [];
	let sectionRow = [];
	for (let i = 1; i <= sectionList[sectionNumber - 1].length; i++) {
		const unit = sectionList[sectionNumber - 1][i - 1];
		sectionRow.push({
			key: unit,
			value: values[unit].length === 1 ? values[unit] : '.',
		});
		if (i % 3 === 0) {
			cellRows = [...cellRows, sectionRow];
			sectionRow = [];
		}
	}
	return cellRows;
};

// Transform a valid sudoku model into an UI Board state
export const generateValuesState = (values) => {
	let valuesState = [];
	let sectionRows = [];
	for (const sectionNumber of digits.split('')) {
		sectionRows.push({
			key: String(sectionNumber),
			cellRows: getSectionUnits(sectionNumber, values),
		});
		if (sectionNumber % 3 === 0) {
			valuesState = [...valuesState, [...sectionRows]];
			sectionRows = [];
		}
	}
	return valuesState;
};

// Generate a board state based on a valid sudoku string.
export const getBoardState = (values) => {
	return { sections: generateValuesState(values) };
};

export const copy = (inObject) => {
	let outObject, value, key;

	if (typeof inObject !== 'object' || inObject === null) {
		return inObject; // Return the value if inObject is not an object
	}

	// Create an array or object to hold the values
	outObject = Array.isArray(inObject) ? [] : {};

	for (key in inObject) {
		value = inObject[key];

		// Recursively (deep) copy for nested objects, including arrays
		outObject[key] = copy(value);
	}

	return outObject;
};

export const dict = (keys, values) => {
	if (typeof values === 'string' || values === null) {
		return keys.reduce((result, key) => ({ ...result, [key]: values }), {});
	} else if (typeof values === 'object') {
		return keys.reduce(
			(result, key, i) => ({ ...result, [key]: values[i] }),
			{}
		);
	}
};

export const center = (s, w) => {
	let excess = w - s.length;
	while (excess > 0) {
		if (excess % 2) s += ' ';
		else s = ' ' + s;
		excess -= 1;
	}
	return s;
};

export const display = (values) => {
	// Used for debugging
	let width = 0;
	for (const s in squares) {
		if (values[squares[s]].length > width) width = values[squares[s]].length;
	}

	width += 1;
	let seg = '';
	for (let i = 0; i < width; i++) seg += '---';
	const line = '\n' + [seg, seg, seg].join('+');
	let board = '';
	for (const r in rows) {
		for (const c in cols) {
			board += center(values[rows[r] + cols[c]], width);
			if (c == 2 || c == 5) board += '|';
		}
		if (r == 2 || r == 5) board += line;
		board += '\n';
	}
	board += '\n';
	return board;
};

export const isCompleted = (values) => {
	return all(Object.values(values), (square) => square.length === 1);
};

//Return some element of values that is true.
export const some = (values, cb) => {
	for (const digit of values) {
		const response = cb(digit);
		if (response) {
			return response;
		}
	}
	return false;
};

// check if all list values are valid with cb
export const all = (list, cb) => {
	for (const value of list) {
		if (!cb(value)) {
			return false;
		}
	}
	return true;
};

// check if an unit is resolved.
export const isUnitSolved = (unit, values) => {
	return (
		unit
			.map((square) => values[square])
			.sort()
			.join('') === digits
	);
};

export const isSolved = (values) => {
	//A puzzle is solved if each unit is a permutation of the digits 1 to 9.
	return (
		values !== false && all(unitList, (unit) => isUnitSolved(unit, values))
	);
};

export const getSquaresWithFewestCandidates = (values) => {
	return squares
		.filter((square) => values[square].length > 1)
		.sort((s1, s2) => values[s1].length - values[s2].length);
};

export const log = (strategy, squares, digit) => {
	if (strategy === STRATEGIES.BACKTRACKING) {
		addSolutionStepsLog(
			strategy,
			[],
			0,
			'Backtrack Search',
			"From this point was applied Peter Norvig's backtracking search algorithm that to solve every sudoku puzzle."
		);
	} else {
		const squareMsg =
			squares.length > 1 ? squares[0] + ', ' + squares[1] : squares[0];
		const msg =
			squares.length === 1
				? 'was solved with the value: ' + digit
				: 'These cells are the only cells in section with the candidate value ' +
				  digit +
				  '. The candidate must be in one of these cells and can be removed from other cells in column or row.';
		addSolutionStepsLog(
			strategy,
			[...squares],
			digit,
			strategy + ' ( ' + squareMsg + ' )',
			strategy + ' ( ' + squareMsg + ' ) ' + msg
		);
	}
};

export const hasPairValues = (list, values, digit) =>
	list.filter(
		(square) => values[square].length > 1 && values[square].includes(digit)
	).length === 2;

export const getPairSquares = (list, values, digit) =>
	list.filter((square) => values[square].includes(digit));

export const getOuterPeers = (innerList, outerList, values) =>
	innerList.filter(
		(square) => !outerList.includes(square) && values[square].length > 1
	);

export const unsolvedSquares = (list, values) =>
	list.filter((square) => values[square].length > 1);

export const canEliminate = (list, values, digit) =>
	list.filter((square) => values[square].includes(digit)).length > 0;

export const getRandomPuzzle = () => {
	return puzzles[Math.floor(Math.random() * puzzles.length)];
};

export const getSquareUnitRowCol = (unit, square) => [
	unit.filter((sq) => sq.includes(square[0])),
	unit.filter((sq) => sq.includes(square[1])),
];

export const getPeers = (
	unit,
	unitRow,
	unitRows,
	unitCol,
	unitCols,
	values
) => [
	getOuterPeers(unitRow, unitRows, values),
	getOuterPeers(unitCol, unitCols, values),
	getOuterPeers(unit, unitRows, values),
	getOuterPeers(unit, unitCols, values),
];

export const stringBoardValidation = (entryString) => {
	if (!entryString) {
		return ERRORS.EMPTY_VALUE;
	}

	if (!validStringRegExp.test(entryString)) {
		return ERRORS.INVALID_VALUE;
	}

	if (entryString.length !== STRING_BOARD_LENGTH) {
		return ERRORS.INVALID_LENGTH;
	}

	return true;
};
