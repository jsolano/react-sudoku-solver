import React from 'react';
import './style.css';
import Backdrop from '../../components/Backdrop/Backdrop';

const modal = (props) => (
	<div>
		<Backdrop show={props.show} clicked={props.modalClosed} />
		<div
			className="Modal"
			style={{
				transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
				opacity: props.show ? '1' : '0',
			}}
		>
			{props.children}
		</div>
	</div>
);

export default modal;
