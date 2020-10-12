import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
	border: 0;
	appearance: none;
	outline: none;
	cursor: pointer;
	padding: 6px 16px;
	border-radius: var(--border-radius);
	transition: all 300ms ease-in-out;
	font-size: var(--font-size);
	line-height: var(--line-height);
	
	&[data-type=default] {
		
	}
	&[data-type=primary] {
		background-color: var(--primary-color);
		color: var(--invert-color);
		&:hover {
			background-color: var(--primary-hover-color);
		}
	}
`;

export enum ButtonType {
	DEFAULT = 'default',
	PRIMARY = 'primary'
}

export default (props: {
	className?: string,
	type?: ButtonType,
	children?: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { className, type = ButtonType.DEFAULT, children } = props;
	return <Button className={className} data-type={type}>
		{children}
	</Button>;
}