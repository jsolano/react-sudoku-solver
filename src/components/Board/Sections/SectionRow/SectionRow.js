import React, { useState } from 'react';
import './style.css';
import Section from './Section/Section';

const sectionRow = (props) => {
	return props.sectionRow.map((section) => {
		return (
			<div className="game-section" key={props.nameKey + '-' + section.key}>
				<Section
					nameKey={props.nameKey + '-section-' + section.key}
					cellRows={section.cellRows}
				/>
			</div>
		);
	});
};

export default sectionRow;
