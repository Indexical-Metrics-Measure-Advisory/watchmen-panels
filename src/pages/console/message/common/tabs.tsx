import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { HorizontalLoading } from '../../component/horizontal-loading';
import { LinkButton } from '../../component/link-button';
import { ActiveTab, State } from './types';

const TabsContainer = styled.div.attrs({
	'data-widget': 'console-messages-tabs'
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
const TabPlaceholder = styled(HorizontalLoading)`
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

export const Tabs = (props: {
	state: State;
	onUnreadClicked: () => void;
	onReadClicked: () => void;
	onClearClicked: () => void;
}) => {
	const { state, onUnreadClicked, onReadClicked, onClearClicked } = props;

	return <TabsContainer>
		<Tab data-active={state.active === ActiveTab.UNREAD}>
			<LinkButton onClick={onUnreadClicked}>Unread</LinkButton>
		</Tab>
		<Tab data-active={state.active === ActiveTab.READ}>
			<LinkButton onClick={onReadClicked}>Previous</LinkButton>
		</Tab>
		<TabPlaceholder
			visible={!(state.active === ActiveTab.UNREAD ? state.unreadInitialized : state.readInitialized)}/>
		<ClearAll data-visible={state.active === ActiveTab.UNREAD} onClick={onClearClicked}>
			<FontAwesomeIcon icon={faCheckCircle}/>
			<span>Clear All</span>
		</ClearAll>
	</TabsContainer>;
};