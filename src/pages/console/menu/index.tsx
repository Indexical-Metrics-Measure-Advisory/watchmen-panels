import { faBell, faInbox, faStar } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Theme } from '../../../theme/types';
import { MenuLogo } from './logo';
import { MenuItem } from './menu-item';
import { MenuSeparator } from './menu-separator';
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

	const showMenuItemTooltip = width / minWidth <= 1.5;

	return <MenuContainer width={width}>
		<MenuLogo/>
		<MenuItem icon={faBell} label='Notifications' showTooltip={showMenuItemTooltip}/>
		<MenuItem icon={faInbox} label='Inbox' showTooltip={showMenuItemTooltip}/>
		<MenuItem icon={faStar} label='Show Favorites' showTooltip={showMenuItemTooltip}/>
		<MenuSeparator/>
		<Placeholder/>
		<ResizeHandle width={width} onResize={onResize}/>
	</MenuContainer>;
}