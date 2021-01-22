import {
	faGlobe,
	faHome,
	faImages,
	faTags,
	faTasks,
	faUserCog,
	faUsersCog,
	faWaveSquare
} from '@fortawesome/free-solid-svg-icons';
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
	display          : flex;
	position         : relative;
	flex-direction   : column;
	align-items      : flex-start;
	width            : ${({ width }) => `${width}px`};
	min-width        : var(--console-menu-width);
	height           : 100vh;
	top              : 0;
	left             : 0;
	border-right     : var(--border);
	background-color : var(--invert-color);
	overflow         : hidden;
	// TODO hide tasks button
	> div:nth-child(10) {
		display : none;
	}
`;
const Placeholder = styled.div`
	flex-grow : 1;
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
	const onMenuClicked = (path: string) => () => {
		if (!matchPath(location.pathname, path)) {
			history.push(path);
		}
	};

	const showMenuItemTooltip = menuWidth / minWidth <= 1.5;

	return <MenuContainer width={menuWidth}>
		<MenuLogo title='Watchmen Admin'/>
		<MenuItem icon={faHome} label='Home' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_HOME)}
		          onClick={onMenuClicked(Path.ADMIN_HOME)}/>
		<MenuItem icon={faTags} label='Topics' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_TOPICS)}
		          onClick={onMenuClicked(Path.ADMIN_TOPICS)}/>
		<MenuItem icon={faImages} label='Reports' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_REPORTS)}
		          onClick={onMenuClicked(Path.ADMIN_REPORTS)}/>
		<MenuItem icon={faGlobe} label='Spaces' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_SPACES)}
		          onClick={onMenuClicked(Path.ADMIN_SPACES)}/>
		<MenuItem icon={faWaveSquare} label='Pipelines' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_PIPELINE)}
		          onClick={onMenuClicked(Path.ADMIN_PIPELINE)}/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faUsersCog} label='User Groups' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_USER_GROUPS)}
		          onClick={onMenuClicked(Path.ADMIN_USER_GROUPS)}/>
		<MenuItem icon={faUserCog} label='Users' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_USERS)}
		          onClick={onMenuClicked(Path.ADMIN_USERS)}/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faTasks} label='Tasks' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.ADMIN_TASKS)}
		          onClick={onMenuClicked(Path.ADMIN_TASKS)}/>
		<Placeholder/>
		<MenuSeparator width={menuWidth}/>
		<MenuUser user={user}/>
		<ResizeHandle width={menuWidth} onResize={onResize}/>
	</MenuContainer>;
};