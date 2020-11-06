import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-background.png';
import { Notifications } from '../../../services/console/types';
import { useNotImplemented } from '../../context/not-implemented';
import { HorizontalLoading } from '../component/horizontal-loading';
import { LinkButton } from '../component/link-button';
import { PageContainer } from '../component/page-container';
import { useConsoleContext } from '../context/console-context';
import { NotificationItem } from './item';

enum ActiveTab {
	READ = 'read',
	UNREAD = 'unread'
}

interface State {
	active: ActiveTab;
	readInitialized: boolean;
	unreadInitialized: boolean;
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

const NotificationList = (props: {
	notifications: Notifications;
	allLoaded: boolean;
	visible: boolean;
	status: ActiveTab
}) => {
	const { notifications, allLoaded, visible, status } = props;

	if (!visible) {
		return null;
	}

	return <Content>
		{notifications.map((notification, index) => {
			return <NotificationItem data={notification} readable={status === ActiveTab.UNREAD}
			                         key={`${notification.createDate}-${index}`}/>;
		})}
		<SeeAll data-visible={allLoaded}>
			{notifications.length === 0 ? 'No notifications.' : ' You\'ve seen it all.'}
		</SeeAll>
	</Content>;
};

export const Notification = () => {
	const notImpl = useNotImplemented();
	const context = useConsoleContext();
	const [ state, setState ] = useState<State>({
		active: ActiveTab.UNREAD,
		readInitialized: false,
		unreadInitialized: false
	});
	// load data only when state change
	useEffect(() => {
		(async () => {
			if (state.active === ActiveTab.UNREAD && !state.unreadInitialized) {
				await context.notifications.fetchUnread();
				setState({ ...state, unreadInitialized: true });
			} else if (state.active === ActiveTab.READ && !state.readInitialized) {
				await context.notifications.fetchRead();
				setState({ ...state, readInitialized: true });
			}
		})();
		// eslint-disable-next-line
	}, [ state ]);

	const onTabClicked = (activeTab: ActiveTab) => () => {
		if (activeTab !== state.active) {
			setState({ ...state, active: activeTab });
		}
	};

	return <NotificationContainer background-image={BackgroundImage}>
		<Title>
			<div>Notifications</div>
			<LinkButton tooltip='Settings' ignoreHorizontalPadding={true}
			            onClick={notImpl.show}>
				<FontAwesomeIcon icon={faCog}/>
			</LinkButton>
		</Title>
		<Tabs>
			<Tab data-active={state.active === ActiveTab.UNREAD}>
				<LinkButton onClick={onTabClicked(ActiveTab.UNREAD)}>Unread</LinkButton>
			</Tab>
			<Tab data-active={state.active === ActiveTab.READ}>
				<LinkButton onClick={onTabClicked(ActiveTab.READ)}>Folded</LinkButton>
			</Tab>
			<Placeholder
				visible={!(state.active === ActiveTab.UNREAD ? state.unreadInitialized : state.readInitialized)}/>
			<ClearAll data-visible={state.active === ActiveTab.UNREAD} onClick={context.notifications.readAll}>
				<FontAwesomeIcon icon={faCheckCircle}/>
				<span>Clear All</span>
			</ClearAll>
		</Tabs>
		<NotificationList notifications={context.notifications.unread}
		                  allLoaded={context.notifications.allUnreadLoaded}
		                  visible={state.active === ActiveTab.UNREAD}
		                  status={ActiveTab.UNREAD}/>
		<NotificationList notifications={context.notifications.read} allLoaded={context.notifications.allReadLoaded}
		                  visible={state.active === ActiveTab.READ}
		                  status={ActiveTab.READ}/>
	</NotificationContainer>;
};