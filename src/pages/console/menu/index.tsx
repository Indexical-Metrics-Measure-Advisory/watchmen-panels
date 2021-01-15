import { faBell, faComments } from '@fortawesome/free-regular-svg-icons';
import {
	faCog,
	faCompactDisc,
	faGlobe,
	faHome,
	faInbox,
	faPlus,
	faStar,
	faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Path, { isConnectedSpaceOpened, toConnectedSpace } from '../../../common/path';
import { useForceUpdate } from '../../../common/utils';
import { ConnectedConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';
import { Theme } from '../../../theme/types';
import { MenuItem } from '../../component/console/menu/menu-item';
import { MenuLogo } from '../../component/console/menu/menu-logo';
import { MenuSeparator } from '../../component/console/menu/menu-separator';
import { MenuUser } from '../../component/console/menu/menu-user';
import { ResizeHandle } from '../../component/console/menu/resize-handle';
import { useConsoleContext } from '../context/console-context';

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
const FavMenu = styled(MenuItem)`
	&[data-active=true] {
		> div:first-child {
			color: var(--console-favorite-color);
			background-color: transparent;
		}
	}
`;
const SpaceMenus = styled.div`
	display: flex;
	flex-direction: column;
	max-height: calc(var(--console-menu-height) * 5);
	overflow-y: scroll;
	overflow-x: hidden;
	direction: rtl;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
	> div {
		margin-left: -4px;
	}
`;
const SpaceMenu = styled(MenuItem)`
	direction: ltr;
`;
const ConnectMenu = styled(MenuItem)`
	color: var(--console-waive-color);
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export const ConsoleMenu = () => {
	const history = useHistory();
	const location = useLocation();
	const theme = useTheme();
	const minWidth = (theme as Theme).consoleMenuWidth;
	const maxWidth = (theme as Theme).consoleMenuMaxWidth;
	const {
		user,
		menu: { menuWidth, setMenuWidth },
		favorites,
		spaces: {
			connected: spaces,
			addSpaceAddedListener, removeSpaceAddedListener,
			addSpaceDeletedListener, removeSpaceDeletedListener,
			addSpaceRenamedListener, removeSpaceRenamedListener
		}
	} = useConsoleContext();

	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addSpaceAddedListener(forceUpdate);
		addSpaceDeletedListener(forceUpdate);
		addSpaceRenamedListener(forceUpdate);
		return () => {
			removeSpaceAddedListener(forceUpdate);
			removeSpaceDeletedListener(forceUpdate);
			removeSpaceRenamedListener(forceUpdate);
		};
	}, [ addSpaceDeletedListener, removeSpaceDeletedListener, addSpaceRenamedListener, removeSpaceRenamedListener, forceUpdate ]);

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
	const onTimelineClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_TIMELINE)) {
			history.push(Path.CONSOLE_TIMELINE);
		}
	};
	const onFavoriteClicked = (rect: DOMRect) => {
		const { visible } = favorites;
		if (!visible) {
			favorites.show(rect, !showMenuItemTooltip);
		}
	};
	const onSpaceClicked = (space: ConnectedConsoleSpace) => () => {
		if (isConnectedSpaceOpened(space.connectId)) {
			return;
		}

		history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE, space.connectId));
	};
	const onSettingsClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_SETTINGS)) {
			history.push(Path.CONSOLE_SETTINGS);
		}
	};
	const onSpaceConnectClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_SPACES)) {
			history.push(Path.CONSOLE_SPACES);
		}
	};
	const onDashboardsClicked = () => {
		if (!matchPath(location.pathname, Path.CONSOLE_DASHBOARDS)) {
			history.push(Path.CONSOLE_DASHBOARDS);
		}
	};

	const showMenuItemTooltip = menuWidth / minWidth <= 1.5;

	return <MenuContainer width={menuWidth}>
		<MenuLogo/>
		<MenuItem icon={faHome} label='Home' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_HOME)}
		          onClick={onHomeClicked}/>
		<MenuItem icon={faTachometerAlt} label='Dashboards' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_DASHBOARDS)}
		          onClick={onDashboardsClicked}/>
		<FavMenu icon={faStar} label='Show Favorites' showTooltip={showMenuItemTooltip}
		         active={favorites.visible}
		         onClick={onFavoriteClicked}/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faBell} label='Notifications' iconSize={1.2} showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_NOTIFICATION)}
		          onClick={onNotificationsClicked}/>
		<MenuItem icon={faInbox} label='Inbox' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_INBOX)}
		          onClick={onInboxClicked}/>
		<MenuItem icon={faComments} iconSize={1.2} label='Show Timeline' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_TIMELINE)}
		          onClick={onTimelineClicked}/>
		<MenuSeparator width={menuWidth}/>
		<SpaceMenus>
			{spaces
				.sort((s1, s2) => s1.name.localeCompare(s2.name))
				.map(space => {
					return <SpaceMenu icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}
					                  label={space.name}
					                  showTooltip={showMenuItemTooltip}
					                  onClick={onSpaceClicked(space)}
					                  key={`space-${space.connectId}`}/>;
				})}
		</SpaceMenus>
		<ConnectMenu icon={faPlus} iconSize={0.8} label='Connect New Space' showTooltip={showMenuItemTooltip}
		             onClick={onSpaceConnectClicked}/>
		<Placeholder/>
		<MenuSeparator width={menuWidth}/>
		<MenuItem icon={faCog} iconSize={1.2} label='Settings' showTooltip={showMenuItemTooltip}
		          active={!!matchPath(location.pathname, Path.CONSOLE_SETTINGS)}
		          onClick={onSettingsClicked}/>
		<MenuUser user={user}/>
		<ResizeHandle width={menuWidth} onResize={onResize}/>
	</MenuContainer>;
};