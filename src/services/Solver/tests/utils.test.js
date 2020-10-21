import { isUnitSolved, isSolved, getBoardState } from '../utils';

import { initialSudokuString } from '../constants';

import { parseGrid } from '../solver';

import { initialValuesState, puzzle1Solved } from './data';

import { digits } from '../utils';

describe('util', () => {
	it('getBoardState', () => {
		const values = parseGrid(initialSudokuString);

		expect(getBoardState(values)).toEqual(
			expect.objectContaining(initialValuesState)
		);
	});

	it('isUnitSolved', () => {
		const col = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1'];
		expect(isUnitSolved(col, puzzle1Solved)).toEqual(true);

		const row = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'];
		expect(isUnitSolved(row, puzzle1Solved)).toEqual(true);

		const section = ['G7', 'G8', 'G9', 'H7', 'H8', 'H9', 'I7', 'I8', 'I9'];
		expect(isUnitSolved(section, puzzle1Solved)).toEqual(true);
	});

	it('isSolved', () => {
		expect(isSolved(puzzle1Solved)).toEqual(true);
	});
});
