import React from 'react';
import './style.css';
import CellRow from './CellRow/CellRow';

const section = (props) => {
	return props.cellRows.map((cellRow, index) => {
		return (
			<div className="section-row" key={props.nameKey + '-cellRow-' + index}>
				<CellRow
					class="cell-row"
					nameKey={props.nameKey + '-cellRow-' + index}
					cells={cellRow}
				/>
			</div>
		);
	});
};

export default section;
