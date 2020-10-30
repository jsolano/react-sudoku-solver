import { parseGrid } from '../../Solver/solver';

import {
	initialSudokuString,
	validStringRegExp,
	emptySudokuString,
} from '../constants';

import { initialValuesState, parserGrid3 } from './data';

import { getBoardState } from '../utils';

describe('config', () => {
	it('getBoardState', () => {
		const values = parseGrid(initialSudokuString);
		expect(getBoardState(values)).toEqual(
			expect.objectContaining(initialValuesState)
		);
	});

	it('emptySudokuString', () => {
		const expected = '.'.repeat(81);
		expect(emptySudokuString).toEqual(expected);
	});

	it('initialSudokuString', () => {
		expect(initialSudokuString.length).toEqual(81);
		expect(initialSudokuString).toEqual(
			expect.stringMatching(validStringRegExp)
		);
	});

	it('parseGrid', () => {
		expect(parseGrid(initialSudokuString)).toEqual(parserGrid3);
	});
});
