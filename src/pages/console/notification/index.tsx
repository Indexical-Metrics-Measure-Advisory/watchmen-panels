import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-background.png';
import { listClearedNotifications, listNewNotifications } from '../../../services/console/notification';
import { Notifications } from '../../../services/console/types';
import { useNotImplemented } from '../../context/not-implemented';
import { HorizontalLoading } from '../component/horizontal-loading';
import { LinkButton } from '../component/link-button';
import { PageContainer } from '../component/page-container';
import { NotificationItem } from './item';

enum ActiveTab {
	NEW = 'new',
	CLEAR = 'clear'
}

interface DataState {
	initialized: boolean;
	allLoaded: boolean;
	notifications: Notifications;
}

const NotificationContainer = styled(PageContainer).attrs({
	'data-widget': 'console-notification-container'
})`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	max-width: 1000px;
	min-width: 600px;
	margin: var(--margin) auto;
`;
const Title = styled.div.attrs({
	'data-widget': 'console-notification-title'
})`
	display: flex;
	align-items: baseline;
	> div:first-child {
		font-family: var(--console-title-font-family);
		font-size: 3em;
		letter-spacing: 1px;
	}
	> button {
		margin-left: calc(var(--margin) / 2);
		font-size: 1.4em;
		color: var(--console-primary-color);
	}
`;
const Tabs = styled.div.attrs({
	'data-widget': 'console-notification-tabs'
})`
	display: flex;
	margin-top: var(--margin);
	margin-left: calc(var(--margin) / 2 * -1);
`;
const Tab = styled.div`
	display: flex;
	align-items: center;
	&[data-active=true] {
		> button {
			color: var(--console-primary-color);
		}
	}
	&[data-active=false] {
		> button {
			color: var(--console-waive-color);
		}
	}
	> button {
		font-size: 1.2em;
		font-weight: var(--font-bold);
	}
`;
const Placeholder = styled(HorizontalLoading)`
	flex-grow: 1;
`;

const ClearAll = styled.button`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	padding: 4px calc(var(--margin) / 2);
	border: 0;
	border-radius: var(--border-radius);
	appearance: none;
	outline: none;
	background-color: transparent;
	color: var(--console-primary-color);
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		color: var(--console-primary-color);
		background-color: var(--invert-color);
		box-shadow: var(--console-hover-shadow);;
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;
const Content = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	flex-grow: 1;
`;
const SeeAll = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50px 0;
	opacity: 0;
	user-select: none;
	pointer-events: none;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 0.7;
	}
`;

export const Notification = () => {
	const notImpl = useNotImplemented();
	const [ active, setActive ] = useState<ActiveTab>(ActiveTab.NEW);
	const [ newNotifications, setNewNotifications ] = useState<DataState>({
		initialized: false,
		allLoaded: false,
		notifications: []
	});
	const [ clearedNotifications, setClearedNotifications ] = useState<DataState>({
		initialized: false,
		allLoaded: false,
		notifications: []
	});
	useEffect(() => {
		if (!newNotifications.initialized) {
			listNotifications(active);
		}
	});

	const listNotifications = async (active: ActiveTab) => {
		const state = active === ActiveTab.NEW ? newNotifications : clearedNotifications;
		const set = active === ActiveTab.NEW ? setNewNotifications : setClearedNotifications;
		const pageSize = 30;
		const fetcher = active === ActiveTab.NEW ? listNewNotifications : listClearedNotifications;
		const data = await fetcher({ pageSize });
		if (data.notifications.length === 0) {
			// set as all loaded
			set({ ...state, initialized: true, allLoaded: true });
		} else {
			set({
				...state,
				initialized: true,
				allLoaded: data.allLoaded,
				notifications: [ ...state.notifications, ...data.notifications ]
			});
		}
	};

	const getActiveState = (active: ActiveTab) => {
		return active === ActiveTab.NEW ? newNotifications : clearedNotifications;
	};
	const onTabClicked = (activeTab: ActiveTab) => () => {
		if (activeTab !== active) {
			const state = getActiveState(activeTab);
			if (!state.initialized) {
				listNotifications(activeTab);
			}
			setActive(activeTab);
		}
	};
	const onClearAllClicked = () => {
		const { notifications } = newNotifications;
		setNewNotifications({ ...newNotifications, notifications: [] });
		setClearedNotifications({
			...clearedNotifications,
			notifications: [ ...clearedNotifications.notifications, ...notifications ].sort((n1, n2) => 0 - n1.createDate.localeCompare(n2.createDate))
		});
	};

	const state = getActiveState(active);

	return <NotificationContainer background-image={BackgroundImage}>
		<Title>
			<div>Notifications</div>
			<LinkButton tooltip='Settings' ignoreHorizontalPadding={true}
			            onClick={notImpl.show}>
				<FontAwesomeIcon icon={faCog}/>
			</LinkButton>
		</Title>
		<Tabs>
			<Tab data-active={active === ActiveTab.NEW}>
				<LinkButton onClick={onTabClicked(ActiveTab.NEW)}>New</LinkButton>
			</Tab>
			<Tab data-active={active === ActiveTab.CLEAR}>
				<LinkButton onClick={onTabClicked(ActiveTab.CLEAR)}>Clear</LinkButton>
			</Tab>
			<Placeholder visible={!(active === ActiveTab.NEW ? newNotifications : clearedNotifications).initialized}/>
			<ClearAll data-visible={active === ActiveTab.NEW} onClick={onClearAllClicked}>
				<FontAwesomeIcon icon={faCheckCircle}/>
				<span>Clear All</span>
			</ClearAll>
		</Tabs>
		<Content>
			{state.notifications.map((notification, index) => {
				return <NotificationItem data={notification} key={index}/>;
			})}
			<SeeAll data-visible={state.allLoaded}>
				{state.notifications.length === 0 ? 'No notifications.' : ' You\'ve seen it all.'}
			</SeeAll>
		</Content>
	</NotificationContainer>;
};