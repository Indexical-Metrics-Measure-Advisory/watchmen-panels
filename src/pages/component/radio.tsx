import React from 'react';
import styled from 'styled-components';

const RadioButton = styled.div.attrs(() => ({
	'data-widget': 'radio'
}))`
	display: block;
	position: relative;
	width: 22px;
	height: 22px;
	border: var(--border);
	border-width: 2px;
	border-radius: 100%;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		border-color: var(--primary-color);
	}
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 100%;
		transition: all 300ms ease-in-out;
	}
	&[data-selected=true] {
		&:before {
			top: 1px;
			left: 1px;
			width: 16px;
			height: 16px;
			background-color: var(--border-color);
		}
		&:hover:before {
			background-color: var(--primary-color);
		}
	}
`;

const Radio = (props: {
	selected: boolean;
	onSelected?: () => void
}) => {
	const { selected, onSelected } = props;

	return <RadioButton data-selected={selected} onClick={() => !selected && onSelected && onSelected()}/>;
};

export default Radio;