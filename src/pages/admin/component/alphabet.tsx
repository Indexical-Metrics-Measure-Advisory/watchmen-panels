import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	grid-template-columns: repeat(26, 1fr);
	border-top: var(--border);
	border-bottom: var(--border);
	border-color: var(--console-primary-color);
`;
const Char = styled.div.attrs<{ active: boolean }>(({ active }) => {
	return {
		style: {
			backgroundColor: active ? 'var(--console-primary-color)' : '',
			color: active ? 'var(--invert-color)' : ''
		}
	};
})<{ active: boolean }>`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	font-family: var(--console-title-font-family);
	height: 32px;
	//border-top-left-radius: var(--border-radius);
	//border-top-right-radius: var(--border-radius);
	cursor: pointer;
	margin-bottom: -1px;
	transition: all 300ms ease-in-out;
	&:hover {
		background-color: var(--console-favorite-color);
		color: var(--invert-color);
	}
`;

export const Alphabet = (props: {
	onClick: (char: string) => void;
	className?: string;
}) => {
	const { onClick, className } = props;

	const [ activeChar, setActiveChar ] = useState<string>('A');
	const onCharClicked = (char: string) => () => {
		if (activeChar === char) {
			return;
		}

		setActiveChar(char);
		onClick(char);
	};

	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	return <Container className={className}>
		{chars.split('').map(char => {
			return <Char key={char} active={char === activeChar}
			             onClick={onCharClicked(char)}>
				{char}
			</Char>;
		})}
	</Container>;
};