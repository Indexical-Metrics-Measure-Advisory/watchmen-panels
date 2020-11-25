import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { CarvedButton } from '../../../component/console/carved-button';
import { HorizontalLoading } from '../../../component/console/horizontal-loading';
import { LinkButton } from '../../../component/console/link-button';
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
		<CarvedButton data-visible={state.active === ActiveTab.UNREAD} onClick={onClearClicked}>
			<FontAwesomeIcon icon={faCheckCircle}/>
			<span>Clear All</span>
		</CarvedButton>
	</TabsContainer>;
};