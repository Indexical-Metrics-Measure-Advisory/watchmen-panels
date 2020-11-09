import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-inbox-background.png';
import { Mails } from '../../../services/console/types';
import { useNotImplemented } from '../../context/not-implemented';
import { HorizontalLoading } from '../component/horizontal-loading';
import { LinkButton } from '../component/link-button';
import { PageContainer } from '../component/page-container';
import { useConsoleContext } from '../context/console-context';
import { InboxItem } from './item';

enum ActiveTab {
	READ = 'read',
	UNREAD = 'unread'
}

interface State {
	active: ActiveTab;
	readInitialized: boolean;
	unreadInitialized: boolean;
}

const InboxContainer = styled(PageContainer).attrs({
	'data-widget': 'console-inbox-container'
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
	'data-widget': 'console-inbox-title'
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
	'data-widget': 'console-inbox-tabs'
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

const InboxList = (props: {
	mails: Mails;
	allLoaded: boolean;
	visible: boolean;
	status: ActiveTab
}) => {
	const { mails, allLoaded, visible, status } = props;

	if (!visible) {
		return null;
	}

	return <Content>
		{mails.map((mail, index) => {
			return <InboxItem data={mail} readable={status === ActiveTab.UNREAD}
			                  key={`${mail.createDate}-${index}`}/>;
		})}
		<SeeAll data-visible={allLoaded}>
			{mails.length === 0 ? 'No mails.' : ' You\'ve seen it all.'}
		</SeeAll>
	</Content>;
};

export const Inbox = () => {
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
				await context.mails.fetchUnread();
				setState({ ...state, unreadInitialized: true });
			} else if (state.active === ActiveTab.READ && !state.readInitialized) {
				await context.mails.fetchRead();
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

	return <InboxContainer background-image={BackgroundImage}>
		<Title>
			<div>Inbox</div>
			<LinkButton tooltip='Settings'
			            width={26}
			            center={true}
			            ignoreHorizontalPadding={true}
			            onClick={notImpl.show}>
				<FontAwesomeIcon icon={faCog}/>
			</LinkButton>
		</Title>
		<Tabs>
			<Tab data-active={state.active === ActiveTab.UNREAD}>
				<LinkButton onClick={onTabClicked(ActiveTab.UNREAD)}>Unread</LinkButton>
			</Tab>
			<Tab data-active={state.active === ActiveTab.READ}>
				<LinkButton onClick={onTabClicked(ActiveTab.READ)}>Previous</LinkButton>
			</Tab>
			<Placeholder
				visible={!(state.active === ActiveTab.UNREAD ? state.unreadInitialized : state.readInitialized)}/>
			<ClearAll data-visible={state.active === ActiveTab.UNREAD} onClick={context.mails.readAll}>
				<FontAwesomeIcon icon={faCheckCircle}/>
				<span>Clear All</span>
			</ClearAll>
		</Tabs>
		<InboxList mails={context.mails.unread}
		           allLoaded={context.mails.allUnreadLoaded}
		           visible={state.active === ActiveTab.UNREAD}
		           status={ActiveTab.UNREAD}/>
		<InboxList mails={context.mails.read} allLoaded={context.mails.allReadLoaded}
		           visible={state.active === ActiveTab.READ}
		           status={ActiveTab.READ}/>
	</InboxContainer>;
};