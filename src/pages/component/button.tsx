import React from 'react';
import styled from 'styled-components';

export enum ButtonType {
	DEFAULT = 'default',
	PRIMARY = 'primary'
}

interface ButtonProps {
	inkType?: ButtonType
}

const Button = styled.button.attrs<ButtonProps>(({ inkType = ButtonType.DEFAULT }) => ({
	'data-ink-type': inkType
}))<ButtonProps>`
	border: 0;
	appearance: none;
	outline: none;
	cursor: pointer;
	padding: 6px 16px;
	border-radius: var(--border-radius);
	transition: all 300ms ease-in-out;
	font-size: var(--font-size);
	line-height: var(--line-height);
	
	&[data-ink-type=default] {
		
	}
	&[data-ink-type=primary] {
		background-color: var(--primary-color);
		color: var(--invert-color);
		&:hover {
			background-color: var(--primary-hover-color);
		}
	}
`;


export default Button;
