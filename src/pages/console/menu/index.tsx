import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';
import { MenuLogo } from './logo';
import { ResizeHandle } from './resize-handle';

const MenuContainer = styled.div.attrs({
	'data-widget': 'menu-container'
})<{ width: number }>`
	display: flex;
	position: fixed;
	flex-direction: column;
	align-items: flex-start;
	width: ${({ width }) => `${width}px`};
	min-width: var(--console-menu-width);
	height: 100vh;
	top: 0;
	left: 0;
	border-right: var(--border);
	background-color: var(--invert-color);
	overflow: hidden;
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const theme = useTheme();
	const minWidth = (theme as Theme).consoleMenuWidth;
	const maxWidth = (theme as Theme).consoleMenuMaxWidth;
	const [ width, setWidth ] = useState<number>(minWidth);

	const onResize = (newWidth: number) => {
		setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
	};

	return <MenuContainer width={width}>
		<MenuLogo/>
		<Placeholder/>
		<ResizeHandle width={width} onResize={onResize}/>
	</MenuContainer>;
}