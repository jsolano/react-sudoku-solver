import React from 'react';
import './style.css';
import SectionRow from './SectionRow/SectionRow';

const sections = (props) => {
	return props.sections.map((sectionRow, sectionIndex) => {
		return (
			<div
				className="game-sections-row"
				key={props.nameKey + '-sections-' + sectionIndex}
			>
				<SectionRow
					nameKey={props.nameKey + '-sectionRow-' + sectionIndex}
					sectionRow={sectionRow}
				/>
			</div>
		);
	});
};

export default sections;
