import React, { useState } from 'react';
import './style.css';
import Cell from './Cell/Cell';

const cellRow = (props) => {
	return props.cells.map((cell, index) => {
		return <Cell class="game-cell" key={cell.key} cell={cell} />;
	});
};

export default cellRow;
