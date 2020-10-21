import React, { useState } from 'react';
import './style.css';
import Sections from './Sections/Sections';

const board = (props) => {
	let sections = null;

	if (props.board) {
		sections = (
			<div>
				<Sections
					nameKey={props.name + '-sections'}
					sections={props.board.sections}
				/>
			</div>
		);
	}

	return <div className={props.class}>{sections}</div>;
};

export default board;
