import { faCompactDisc, faGlobe, faSolarPanel, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Path, { isConnectedSpaceOpened, isDashboardOpened, toConnectedSpace, toDashboard } from '../../../common/path';
import { notInMe, useForceUpdate } from '../../../common/utils';
import {
	ConnectedConsoleSpace,
	ConsoleDashboard,
	ConsoleFavorite,
	ConsoleFavoriteDashboard,
	ConsoleFavoriteSpace,
	ConsoleFavoriteType,
	ConsoleSpaceType
} from '../../../services/console/types';
import { Theme } from '../../../theme/types';
import { useConsoleContext } from '../context/console-context';

const FavoriteContainer = styled.div.attrs({
	'data-widget': 'console-favorite-container'
})<{
	itemCount: number,
	pinnedLeft: number,
	invoker: { rect: { x: number; y: number; width: number; height: number }, isMenuExpanded: boolean }
}>`
	display: flex;
	position: fixed;
	flex-direction: column;
	box-shadow: var(--console-hover-shadow);
	border-radius: calc(var(--border-radius) * 3);
	background-color: var(--invert-color);
	opacity: 0;
	pointer-events: none;
	min-width: 180px;
	height: calc(var(--margin) / 3 * 3 + 20 + 28 * ${({ itemCount }) => itemCount});
	padding: calc(var(--margin) / 3);
	transition: all 300ms ease-in-out;
	transform: scale3d(0, 0, 0);
	transform-origin: left center;
	z-index: 6000;
	top: ${({ invoker: { rect: { y, height }, isMenuExpanded } }) => isMenuExpanded ? y + height : y}px;
	left: ${({
		         theme,
		         invoker: {
			         rect: { x },
			         isMenuExpanded
		         }
	         }) => isMenuExpanded ? (x + 20) : (theme.consoleMenuWidth - 2)}px;
	&[data-visible=true] {
		transform: scale3d(1, 1, 1);
		opacity: 1;
		pointer-events: auto;
	}
	&[data-pinned=true] {
		top: 0;
		left: ${({ pinnedLeft }) => pinnedLeft}px;
		width: calc(100vw - ${({ pinnedLeft }) => pinnedLeft}px - 15px);
		border-radius: 0;
		box-shadow: none;
		border-bottom: var(--border);
		padding: 0;
		transition: none;
		z-index: 4000;
		flex-direction: row;
		> div:first-child {
			height: var(--console-favorite-pinned-height);
			padding: 0 calc(var(--margin) / 3);
			background-color: var(--invert-color);
			z-index: 1;
			> div:last-child {
				position: absolute;
				right: 0;
				top: 0;
				height: var(--console-favorite-pinned-height);
				width: 60px;
				padding: 0 calc(var(--margin) / 3);
			}
		}
		> div:last-child {
			flex-direction: row;
			margin-top: 0;
			margin-right: 60px;
			align-items: center;
			> div {
				margin-left: calc(var(--margin) / 3);
				padding: 0 calc(var(--margin) / 3);
				height: 24px;
				min-height: 24px;
				border: var(--border);
				border-radius: 12px;
				&:hover {
					background-color: var(--console-primary-color);
					border-color: var(--console-primary-color);
					color: var(--invert-color);
				}
				&:last-child {
					min-width: calc(var(--margin) / 3);
					background-color: transparent;
					border: 0;
					padding: 0;
					margin: 0;
				}
			}
		}
	}
`;
const FavoriteHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-family: var(--console-title-font-family);
	> div:last-child {
		display: flex;
		align-items: center;
		cursor: pointer;
		&:hover {
			color: var(--console-primary-color);
		}
		> svg {
			margin-right: calc(var(--margin) / 5);
			font-size: 0.8em;
		}
	}
`;
const FavoriteBody = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-y: auto;
	margin-top: calc(var(--margin) / 3);
	max-height: calc(28px * 5);
	&::-webkit-scrollbar {
		background-color: transparent;
		height: 4px;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
	> div {
		display: flex;
		align-items: center;
		min-height: 28px;
		padding-right: calc(var(--margin) / 3);
		font-size: 0.8em;
		opacity: 0.7;
		cursor: pointer;
		&:hover {
			color: var(--console-primary-color);
		}
		> svg {
			margin-right: calc(var(--margin) / 5);
		}
		> span {
			flex-grow: 1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
`;

const isFavDashboard = (fav: ConsoleFavorite): fav is ConsoleFavoriteDashboard => fav.type === ConsoleFavoriteType.DASHBOARD;
const isFavSpace = (fav: ConsoleFavorite): fav is ConsoleFavoriteSpace => fav.type === ConsoleFavoriteType.SPACE;

export const Favorite = () => {
	const history = useHistory();
	const theme = useTheme() as Theme;
	const {
		menu: { menuWidth },
		favorites: {
			items, visible, pinned,
			invoker = {
				rect: {
					x: theme.consoleMenuWidth,
					y: 144,
					width: 32,
					height: 32
				},
				isMenuExpanded: false
			},
			hide, pin, unpin
		},
		dashboards: {
			items: dashboards,
			addDashboardDeletedListener, removeDashboardDeletedListener,
			addDashboardRenamedListener, removeDashboardRenamedListener
		},
		spaces: {
			connected: spaces,
			addSpaceDeletedListener, removeSpaceDeletedListener,
			addSpaceRenamedListener, removeSpaceRenamedListener
		}
	} = useConsoleContext();

	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!pinned) {
			const onWindowClick = (event: FocusEvent | MouseEvent) => {
				if (notInMe(containerRef.current!, event.target)) {
					hide();
				}
			};
			window.addEventListener('click', onWindowClick, true);
			window.addEventListener('focus', onWindowClick, true);
			return () => {
				window.removeEventListener('click', onWindowClick, true);
				window.removeEventListener('focus', onWindowClick, true);
			};
		}
	}, [ pinned, hide ]);
	const forceUpdate = useForceUpdate();
	useEffect(() => {
		addDashboardDeletedListener(forceUpdate);
		addDashboardRenamedListener(forceUpdate);
		addSpaceDeletedListener(forceUpdate);
		addSpaceRenamedListener(forceUpdate);
		return () => {
			removeDashboardDeletedListener(forceUpdate);
			removeDashboardRenamedListener(forceUpdate);
			removeSpaceDeletedListener(forceUpdate);
			removeSpaceRenamedListener(forceUpdate);
		};
	}, [
		addDashboardDeletedListener, removeDashboardDeletedListener,
		addDashboardRenamedListener, removeDashboardRenamedListener,
		addSpaceDeletedListener, removeSpaceDeletedListener,
		addSpaceRenamedListener, removeSpaceRenamedListener,
		forceUpdate
	]);

	const itemCount = items.length;
	const displayItemCount = Math.min(itemCount, 5);
	const onPinClicked = () => pinned ? unpin() : pin();
	const onSpaceClicked = (space: ConnectedConsoleSpace) => () => {
		if (isConnectedSpaceOpened(space.connectId)) {
			return;
		}

		history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE, space.connectId));
	};
	const onDashboardClicked = (dashboard: ConsoleDashboard) => () => {
		if (isDashboardOpened(dashboard.dashboardId)) {
			return;
		}
		history.push(toDashboard(Path.CONSOLE_DASHBOARD, dashboard.dashboardId));
	};

	return <FavoriteContainer data-visible={visible} data-pinned={pinned} pinnedLeft={menuWidth}
	                          itemCount={displayItemCount}
	                          invoker={invoker}
	                          ref={containerRef}>
		<FavoriteHeader>
			<div>Favorite</div>
			<div onClick={onPinClicked}>
				<FontAwesomeIcon icon={faThumbtack}/>
				<span>{pinned ? 'Float' : 'Pin'}</span>
			</div>
		</FavoriteHeader>
		<FavoriteBody>
			{items.map(item => {
				if (isFavDashboard(item)) {
					// eslint-disable-next-line
					const dashboard = dashboards.find(dashboard => dashboard.dashboardId == item.dashboardId);
					if (dashboard) {
						return {
							name: dashboard.name,
							item: <div onClick={onDashboardClicked(dashboard)}
							           key={`dashboard-${item.dashboardId}`}>
								<FontAwesomeIcon icon={faSolarPanel}/>
								<span>{dashboard.name}</span>
							</div>
						};
					}
				} else if (isFavSpace(item)) {
					// eslint-disable-next-line
					const space = spaces.find(space => space.connectId == item.connectId);
					if (space) {
						return {
							name: space.name,
							item: <div onClick={onSpaceClicked(space)}
							           key={`space-${item.connectId}`}>
								<FontAwesomeIcon
									icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
								<span>{space.name}</span>
							</div>
						};
					}
				}
				return null;
			})
				.filter(x => x != null)
				.sort((x1, x2) => x1!.name.localeCompare(x2!.name))
				.map(x => x!.item)}
			{pinned ? <div/> : null}
		</FavoriteBody>
	</FavoriteContainer>;
};