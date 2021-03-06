import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ConsoleMail, ConsoleNotification } from '../../services/console/types';
import { createLinkButtonBackgroundAnimation } from '../component/console/link-button';
import { UserAvatar } from '../component/console/user-avatar';
import { useConsoleContext } from './context/console-context';
import { ConsoleNotificationEvent } from './context/console-nofitications';

enum MessageType {
	NOTIFICATION, MAIL
}

enum StateVisible {
	TRUE = 'true',
	FALSE = 'false',
	CLOSE = 'close'
}

interface State {
	visible: StateVisible;
	type?: MessageType;
	content?: ConsoleNotification | ConsoleMail;
}

// use gpu
const Show = keyframes`
	0%, 100% {
		right: -500px;
		opacity: 0;
		transform: translateZ(0);
	}
	5%, 90% {
		filter: blur(0);
		right: 64px;
		opacity: 1;
		transform: translateZ(0);
	}
	99% {
		filter: blur(40px);
		right: 64px;
		opacity: 0;
		transform: translateZ(0);
	}
`;
const Container = styled.div.attrs({
	'data-widget': 'console-messenger'
})`
	display: block;
	position: fixed;
	z-index: 1000;
	bottom: calc(var(--margin) / 2);
	right: -500px;
	&[data-show=true] {
		animation: ${Show} 8s ease-in-out forwards;
	}
	&[data-show=close] {
		bottom: -200px;
		transition: all 300ms ease-in-out;
		right: 64px;
	}
`;
const Content = styled.div`
	display: grid;
	position: relative;
	grid-template-columns: auto 1fr auto auto;
	grid-template-rows: auto 1fr;
	align-items: center;
	padding: calc(var(--margin) * 0.25) calc(var(--margin) * 0.5) calc(var(--margin) * 0.25) calc(var(--margin) * 0.75);
	border-radius: var(--border-radius);
	background-color: var(--console-primary-color);
	color: var(--invert-color);
	cursor: pointer;
	> svg {
		grid-row: span 2;
		align-self: center;
		font-size: 1.4em;
		margin-right: calc(var(--margin) * 0.75);
	}
	> div:nth-child(2) {
		display: flex;
		align-items: center;
		height: 22px;
		> div:first-child {
			transform: scale(0.7);
			transform-origin: left center;
		}
		> span {
			font-size: 0.8em;
			font-weight: var(--font-bold);
		}
	}
	> div:nth-child(3) {
		font-size: 0.8em;
		font-weight: var(--font-bold);
		opacity: 0.7;
	}
	> div:nth-child(4) {
		display: flex;
		position: relative;
		font-size: 0.8em;
		opacity: 0.7;
		width: calc(var(--margin) / 2);
		height: calc(var(--margin) / 2);
		align-items: center;
		justify-content: center;
		margin-left: calc(var(--margin) / 2);
		${createLinkButtonBackgroundAnimation({ opacity: 0.4 })}
	}
	> div:last-child {
		grid-column: span 3;
		height: 1.8em;
	    line-height: 2em;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    width: 300px;
	}
`;

export const Messenger = () => {
	const context = useConsoleContext();
	const [ schedule, setSchedule ] = useState<number | null>(null);
	const [ state, setState ] = useState<State>({ visible: StateVisible.FALSE });
	const scheduleHide = () => {
		if (schedule) {
			clearTimeout(schedule);
		}
		setSchedule(setTimeout(() => setState({ visible: StateVisible.FALSE }), 8000));
	};
	useEffect(() => {
		const onNotificationReceived = (notification: ConsoleMail) => {
			setState({ visible: StateVisible.TRUE, type: MessageType.NOTIFICATION, content: notification });
			scheduleHide();
		};
		context.notifications.on(ConsoleNotificationEvent.LATEST_RECEIVED, onNotificationReceived);

		return () => {
			context.notifications.off(ConsoleNotificationEvent.LATEST_RECEIVED, onNotificationReceived);
		};
	});
	const onCloseClicked = () => {
		if (schedule) {
			clearTimeout(schedule);
		}
		setSchedule(null);
		setState({ visible: StateVisible.CLOSE });
	};

	return <Container data-show={state.visible}>
		<Content>
			<FontAwesomeIcon icon={faBell}/>
			<div>
				<UserAvatar name={state.content?.sender || ''}/>
				<span>{state.content?.sender}</span>
			</div>
			<div>{dayjs(state.content?.createDate).format('MMM D [at] H:mm')}</div>
			<div onClick={onCloseClicked}><FontAwesomeIcon icon={faTimes}/></div>
			<div>{state.content?.subject}</div>
		</Content>
	</Container>;
};