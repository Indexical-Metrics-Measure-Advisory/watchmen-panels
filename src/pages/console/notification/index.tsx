import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotImplemented } from '../../context/not-implemented';
import { LinkButton } from '../component/link-button';

enum ActiveTab {
	NEW = 'new',
	CLEAR = 'clear'
}

const NotificationContainer = styled.div.attrs({
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
const Placeholder = styled.div`
	flex-grow: 1;
`;
const ClearAll = styled.button`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	padding: 4px calc(var(--margin) / 2);
	border: 1px solid transparent;
	border-radius: var(--border-radius);
	appearance: none;
	outline: none;
	background-color: var(--invert-color);
	color: var(--console-primary-color);
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		border-color: var(--console-primary-color);
		background-color: var(--bg-color);
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;

export const Notification = () => {
	const notImpl = useNotImplemented();
	const [ active, setActive ] = useState<ActiveTab>(ActiveTab.NEW);

	const onTabClicked = (activeTab: ActiveTab) => () => activeTab !== active && setActive(activeTab);

	return <NotificationContainer>
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
			<Placeholder/>
			<ClearAll data-visible={active === ActiveTab.NEW}>
				<FontAwesomeIcon icon={faCheckCircle}/>
				<span>Clear All</span>
			</ClearAll>
		</Tabs>
	</NotificationContainer>;
};