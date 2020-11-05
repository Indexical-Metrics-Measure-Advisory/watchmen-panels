import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
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

export const Notification = () => {

	const [ active, setActive ] = useState<ActiveTab>(ActiveTab.NEW);

	return <NotificationContainer>
		<Title>
			<div>Notifications</div>
			<LinkButton tooltip='Settings' ignoreHorizontalPadding={true}>
				<FontAwesomeIcon icon={faCog}/>
			</LinkButton>
		</Title>
		<Tabs>
			<Tab data-active={active === ActiveTab.NEW}>
				<LinkButton>New</LinkButton>
			</Tab>
			<Tab data-active={active === ActiveTab.CLEAR}>
				<LinkButton>Clear</LinkButton>
			</Tab>
		</Tabs>
	</NotificationContainer>;
};