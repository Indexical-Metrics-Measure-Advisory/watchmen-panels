import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faHome, faInbox, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Path from '../../../common/path';
import { Theme } from '../../../theme/types';
import { MenuItem } from '../../component/console/menu/menu-item';
import { MenuLogo } from '../../component/console/menu/menu-logo';
import { MenuSeparator } from '../../component/console/menu/menu-separator';
import { MenuUser } from '../../component/console/menu/menu-user';
import { ResizeHandle } from '../../component/console/menu/resize-handle';
import { useAdminContext } from '../context/admin-context';

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
const Placeholder = styled.div`
	flex-grow: 1;
`;

export const AdminMenu = () => {
	const history = useHistory();
	const location = useLocation();
	const theme = useTheme();
	const minWidth = (theme as Theme).consoleMenuWidth;
	const maxWidth = (theme as Theme).consoleMenuMaxWidth;
	const {
		user,
		menu: { menuWidth, setMenuWidth }
	} = useAdminContext();

	const onResize = (newWidth: number) => {
		setMenuWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
	};
	const onHomeClicked = () => {
		if (!matchPath(location.pathname, Path.ADMIN_HOME)) {
			history.push(Path.ADMIN_HOME);
		}
	};
	const onNotificationsClicked = () => {
		if (!matchPath(location.pathname, Path.ADMIN_NOTIFICATION)) {
			history.push(Path.ADMIN_NOTIFICATION);
		}
	};
	const onInboxClicked = () => {
		if (!matchPath(location.pathname, Path.ADMIN_INBOX)) {
			history.push(Path.ADMIN_INBOX);
		}
	};
	const onDashboardsClicked = () => {
		if (!matchPath(location.pathname, Path.ADMIN_DASHBOARDS)) {
			history.push(Path.ADMIN_DASHBOARDS);
		}
	};

	const showMenuItemTooltip = menuWidth / minWidth <= 1.5;

	return <MenuContainer width={menuWidth}>
		<MenuLogo title='Watchmen Admin'/>
		<MenuItem icon={faHome} label='Home' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_HOME)}
		          onClick={onHomeClicked}/>
		<MenuItem icon={faTachometerAlt} label='Dashboards' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_DASHBOARDS)}
		          onClick={onDashboardsClicked}/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faBell} label='Notifications' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_NOTIFICATION)}
		          onClick={onNotificationsClicked}/>
		<MenuItem icon={faInbox} label='Inbox' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_INBOX)}
		          onClick={onInboxClicked}/>
		<Placeholder/>
		<MenuSeparator width={menuWidth}/>
		<MenuUser user={user}/>
		<ResizeHandle width={menuWidth} onResize={onResize}/>
	</MenuContainer>;
};