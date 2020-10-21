import { STRATEGIES } from './constants';

let solverStrategy = '';

export const setSolverStrategy = (strategy) => {
	solverStrategy = strategy;
};

export const clearSolverStrategy = () => {
	solverStrategy = '';
};

const logs = {
	solutionSteps: [],
	timeElapsedLog: [],
	gamesBoardLog: [],
};

export const addTimeElapsedLog = (
	timeElapsed,
	boardName,
	runCount,
	status,
	msg
) => {
	logs.timeElapsedLog.push({
		date: new Date().toLocaleString(),
		timeElapsed: timeElapsed,
		boardName: boardName,
		runCount: runCount,
		status: status,
		msg: msg,
	});
};

export const addSolutionStepsLog = (strategy, keys, value, method, msg) => {
	if (solverStrategy !== STRATEGIES.BACKTRACKING) {
		logs.solutionSteps.push({
			strategy: strategy,
			date: new Date().toLocaleString(),
			keys: [...keys],
			value: value,
			method: method,
			msg: msg,
		});
	}
};

export const getLog = (logName) => {
	return logs[logName];
};

export const showSolutionStepsLog = () => {
	console.log('Solution Steps: ', logs.solutionSteps);
};

export const resetLog = (logName) => {
	logs[logName] = [];
	return logs[logName];
};

export const startTimer = () => {
	return Date.now();
};

export const stopTimer = (startTimer) => {
	return Date.now() - startTimer;
};
