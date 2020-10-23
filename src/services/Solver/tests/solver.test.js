import { parseGrid, search, searchPointPair } from '../Solver';
import {
	unitList,
	squares,
	units,
	peers,
	sectionList,
	cross,
	display,
	all,
	getRandomPuzzle,
} from '../../Solver/utils';

import { rows, cols, STRATEGIES } from '../../Solver/constants';

import {
	puzzles,
	parsedGrid1,
	parsedGrid2,
	C2Unit,
	C2Peers,
	puzzle1Solved,
	puzzle2Solved,
	sectionListData,
} from '../tests/data';

describe('solver', () => {
	it('squares', () => {
		expect(squares.length).toEqual(81);
	});

	it('unitList', () => {
		expect(unitList.length).toEqual(27);
	});

	it('cross', () => {
		const expected = squares;
		expect(cross(rows, cols)).toEqual(expect.arrayContaining(expected));
	});

	it('sectionList', () => {
		expect(sectionList).toEqual(expect.arrayContaining(sectionListData));
	});

	it('parseGrid', () => {
		const grid1 = puzzles[1];
		const expected1 = parsedGrid1;
		expect(parseGrid(grid1)).toEqual(expected1);

		const grid2 = puzzles[2];
		const expected2 = parsedGrid2;
		expect(parseGrid(grid2)).toEqual(expected2);
	});

	it('search', () => {
		const grid1 = puzzles[1];
		expect(search(parseGrid(grid1), STRATEGIES.BACKTRACKING)).toEqual(
			puzzle1Solved
		);

		const grid2 = puzzles[2];
		expect(search(parseGrid(grid2), STRATEGIES.BACKTRACKING)).toEqual(
			puzzle2Solved
		);
	});

	it('boardString', () => {
		const sol1 = search(parseGrid(puzzles[1]), STRATEGIES.BACKTRACKING);
		console.log(display(sol1));

		const sol2 = search(parseGrid(puzzles[2]), STRATEGIES.BACKTRACKING);
		console.log(display(sol2));

		const sol3 = search(parseGrid(puzzles[3]), STRATEGIES.BACKTRACKING);
		console.log(display(sol3));
	});

	it('units', () => {
		expect(units['C2']).toEqual(expect.arrayContaining(C2Unit));
	});

	it('peers', () => {
		expect(peers['C2']).toEqual(C2Peers);
	});

	it('Solve ALL', () => {
		// for (const puzzle of puzzles) {
		// 	console.log(puzzle);
		// 	console.log(display(search(parseGrid(puzzle), STRATEGIES.BACKTRACKING)));
		// }
	});

	// it('searchPointPair', () => {
	// 	const grid1 = puzzles[1];
	// 	expect(searchPointPair(parseGrid(grid1))).toEqual(puzzle1Solved);
	// });
});
