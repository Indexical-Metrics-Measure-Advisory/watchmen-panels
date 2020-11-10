import { faBell, faComments, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faHome, faInbox, faPlus, faStar, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Path from '../../../common/path';
import { Theme } from '../../../theme/types';
import { useConsoleContext } from '../context/console-context';
import { MenuItem } from './menu-item';
import { MenuLogo } from './menu-logo';
import { MenuSeparator } from './menu-separator';
import { MenuUser } from './menu-user';
import { ResizeHandle } from './resize-handle';

const MenuContainer = styled.div.attrs({
	'data-widget': 'menu-container'
})<{ width: number }>`
	display: flex;
	position: relative;
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
const ConnectMenu = styled(MenuItem)`
	color: var(--console-waive-color);
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();
	const location = useLocation();
	const theme = useTheme();
	const minWidth = (theme as Theme).consoleMenuWidth;
	const maxWidth = (theme as Theme).consoleMenuMaxWidth;
	const { menu: { menuWidth, setMenuWidth }, favorites } = useConsoleContext();

	const onResize = (newWidth: number) => {
		setMenuWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
	};
	const onHomeClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_HOME)) {
			history.push(Path.CONSOLE_HOME);
		}
	};
	const onNotificationsClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_NOTIFICATION)) {
			history.push(Path.CONSOLE_NOTIFICATION);
		}
	};
	const onInboxClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_INBOX)) {
			history.push(Path.CONSOLE_INBOX);
		}
	};
	const onFavoriteClicked = (rect: DOMRect) => {
		const visible = favorites.visible;
		if (visible) {
			favorites.hide();
		} else {
			favorites.show(rect, !showMenuItemTooltip);
		}
	};

	const showMenuItemTooltip = menuWidth / minWidth <= 1.5;

	return <MenuContainer width={menuWidth}>
		<MenuLogo/>
		<MenuItem icon={faHome} label='Home' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_HOME)}
		          onClick={onHomeClicked}/>
		<MenuItem icon={faTachometerAlt} label='Dashboards' showTooltip={showMenuItemTooltip}/>
		<MenuItem icon={faStar} label='Show Favorites' showTooltip={showMenuItemTooltip}
		          onClick={onFavoriteClicked}/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faBell} label='Notifications' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_NOTIFICATION)}
		          onClick={onNotificationsClicked}/>
		<MenuItem icon={faInbox} label='Inbox' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_INBOX)}
		          onClick={onInboxClicked}/>
		<MenuItem icon={faComments} iconSize={1.2} label='Show Timeline' showTooltip={showMenuItemTooltip}/>
		<MenuSeparator width={menuWidth}/>
		<ConnectMenu icon={faPlus} iconSize={0.8} label='Connect New Space' showTooltip={showMenuItemTooltip}/>
		<Placeholder/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faQuestionCircle} iconSize={1.2} label='Help' showTooltip={showMenuItemTooltip}/>
		<MenuUser/>
		<ResizeHandle width={menuWidth} onResize={onResize}/>
	</MenuContainer>;
}