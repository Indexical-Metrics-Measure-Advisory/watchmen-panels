import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Notification, NotificationCategory } from '../../../services/console/types';
import { createLinkButtonBackgroundAnimation } from '../component/link-button';
import { UserAvatar } from '../component/user-avatar';
import { useConsoleContext } from '../context/console-context';
import { useTooltip } from '../context/console-tooltip';

// use gpu
const ReadAnimation = keyframes`
	0% {
		filter: blur(0);
		opacity: 1;
		transform: translateZ(0) scaleY(100%);
		transform-origin: top;
	}
	99% {
		filter: blur(100px);
		margin-top: 0;
		opacity: 0;
		transform: translateZ(0) scaleY(0);
		transform-origin: top;
	}
	100% {
		display: none;
	}
`;

const Container = styled.div.attrs({
	'data-widget': 'console-notification-item'
})`
	display: flex;
	position: relative;
	flex-direction: column;
	border-radius: calc(var(--border-radius));
	margin-top: var(--margin);
    box-shadow: var(--console-shadow);
    transition: all 300ms ease-in-out;
    &[data-read=true] {
    	animation: ${ReadAnimation} 1s ease-in-out forwards;
    }
    &:hover {
    	box-shadow: var(--console-hover-shadow);
    	div[data-widget='console-notification-item-operators'] {
    		opacity: 1;
    		pointer-events: auto;
    	}
    }
`;
const Header = styled.div`
    border-bottom: var(--border);
    margin-bottom: -1px;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-rows: auto 1fr;
    grid-column-gap: calc(var(--margin) / 2);
    grid-row-gap: calc(var(--margin) / 4);
    align-items: center;
    padding: calc(var(--margin) / 3) calc(var(--margin) / 2) calc(var(--margin) / 4);
    background-color: var(--console-notification-header-bg-color);
    overflow: hidden;
`;
const Category = styled.div`
	font-size: 0.8em;
	line-height: 1em;
	opacity: 0.3;
	font-weight: var(--font-bold);
`;
const Sender = styled.div`
	grid-row: span 2;
	justify-self: center;
	align-self: center;
`;
const Subject = styled.div`
	font-size: 1.4em;
	line-height: 1.8em;
	font-weight: var(--font-bold);
	opacity: 0.9;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	&:hover {
		color: var(--console-primary-color);
	}
`;
const Body = styled.div<{ 'color-type'?: number }>`
	display: grid;
	grid-template-columns: 1fr auto;
    grid-column-gap: calc(var(--margin) / 2);
	padding: 20px calc(var(--margin) / 2);
    background-color: ${({ 'color-type': colorType }) => colorType ? `var(--console-notification-color-${colorType})` : 'unset'};
`;
const BodyContent = styled.div`
	display: flex;
	flex-direction: column;
	line-height: 20px;
    word-break: break-word;
`;
const BodyImage = styled.div`
`;
const CreateAt = styled.div`
	grid-row: span 2;
	font-size: 0.8em;
	opacity: 0.4;
	align-self: start;
	font-weight: var(--font-bold);
`;
const Operators = styled.div.attrs({
	'data-widget': 'console-notification-item-operators'
})`
	grid-row: span 2;
	opacity: 0;
	pointer-events: none;
	transition: all 300ms ease-in-out;
`;
const Read = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	color: var(--console-primary-color);
	border-radius: var(--border-radius);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	${createLinkButtonBackgroundAnimation({ opacity: 0.4 })}
`;

const CategoryLabel: { [key in NotificationCategory]: string } = {
	CHART_TYPE_PUSHED: 'New Chart Type Go Live',

	SPACE_PUSHED: 'New Space Go Live',
	TOPIC_PUSHED: 'New Topic Go Live',
	FACTOR_PUSHED: 'New Factor Go Live',
	INDICATOR_PUSHED: 'New Indicator Go Live',

	REPORT_PUSHED: 'New Report Go Live',
	CHART_PUSHED: 'New Chart Go Live',

	GROUP_JOINED: 'Group Joined',
	GROUP_LEFT: 'Group Left',

	SPACE_JOINED: 'Space Joined',
	SPACE_LEFT: 'Space Left',

	SUBSCRIBE_REPORT_CHANGED: 'Subscribed Report Definition Changed',
	SUBSCRIBE_REPORT_DELETED: 'Subscribed Report Deleted',
	SUBSCRIBE_CHART_CHANGED: 'Subscribed Chart Definition Change',
	SUBSCRIBE_CHART_DELETED: 'Subscribed Chart Deleted'
};
const CategoryColor = (category: NotificationCategory) => {
	switch (category) {
		case NotificationCategory.CHART_TYPE_PUSHED:
			return 1;
		case NotificationCategory.SPACE_PUSHED:
		case NotificationCategory.TOPIC_PUSHED:
		case NotificationCategory.FACTOR_PUSHED:
		case NotificationCategory.INDICATOR_PUSHED:
			return 2;
		case NotificationCategory.REPORT_PUSHED:
		case NotificationCategory.CHART_PUSHED:
			return 3;
		case NotificationCategory.GROUP_JOINED:
		case NotificationCategory.GROUP_LEFT:
		case NotificationCategory.SPACE_JOINED:
		case NotificationCategory.SPACE_LEFT:
			return 4;
		case NotificationCategory.SUBSCRIBE_REPORT_CHANGED:
		case NotificationCategory.SUBSCRIBE_REPORT_DELETED:
		case NotificationCategory.SUBSCRIBE_CHART_CHANGED:
		case NotificationCategory.SUBSCRIBE_CHART_DELETED:
		default:
			return void 0;
	}
};

export const NotificationItem = (props: { data: Notification, readable: boolean }) => {
	const { data, readable } = props;
	const { subject, category, sender, body, image, createDate } = data;

	const context = useConsoleContext();
	const [ read, setRead ] = useState(false);
	const readRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip({
		show: true,
		tooltip: 'Clear Notification',
		rect: ({ left, top }) => ({ x: left + 11, y: top - 36, center: true }),
		ref: readRef
	});
	const onReadClicked = async () => {
		setRead(true);
		setTimeout(() => context.notifications.readOne(data), 1000);
	};

	return <Container data-read={read}>
		<Header>
			<Category>{CategoryLabel[category]}</Category>
			<Operators>
				{readable
					? <Read ref={readRef}
					        onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
					        onClick={onReadClicked}>
						<FontAwesomeIcon icon={faCheck}/>
					</Read>
					: null}
			</Operators>
			<Sender>
				<UserAvatar name={sender} showTooltip={true}/>
			</Sender>
			<Subject>{subject}</Subject>
		</Header>
		<Body color-type={CategoryColor(category)}>
			<BodyContent>
				{(body || '').split('\n').map((line, index) => <span key={index}>{line}</span>)}
			</BodyContent>
			<CreateAt>{dayjs(createDate).format('MMM D [at] H:mm')}</CreateAt>
			<BodyImage>{image}</BodyImage>
		</Body>
	</Container>;
};