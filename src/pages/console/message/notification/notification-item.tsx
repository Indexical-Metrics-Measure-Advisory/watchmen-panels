import React, { useState } from 'react';
import styled from 'styled-components';
import { ConsoleNotification, ConsoleNotificationCategory } from '../../../../services/console/types';
import { UserAvatar } from '../../../component/console/user-avatar';
import { useConsoleContext } from '../../context/console-context';
import {
	ItemBody,
	MessageItemContainer,
	MessageItemHeader,
	MessageItemOperators,
	MessageItemSender,
	MessageItemSubject
} from '../common/item';
import { ReadButton } from '../common/read-button';

const Header = styled(MessageItemHeader)`
    grid-template-rows: auto 1fr;
    grid-row-gap: calc(var(--margin) / 4);
`;
const Operators = styled(MessageItemOperators)`
	grid-row: span 2;
`;
const Sender = styled(MessageItemSender)`
	grid-row: span 2;
`;
const Category = styled.div`
	font-size: 0.8em;
	line-height: 1em;
	opacity: 0.3;
	font-weight: var(--font-bold);
`;
const Body = styled(ItemBody)<{ 'color-type'?: number }>`
    background-color: ${({ 'color-type': colorType }) => colorType ? `var(--console-notification-color-${colorType})` : 'unset'};
`;

const CategoryLabel: { [key in ConsoleNotificationCategory]: string } = {
	CHART_TYPE_PUSHED: 'New Chart Type Go Live',

	SPACE_PUSHED: 'New Space Go Live',
	TOPIC_PUSHED: 'New Topic Go Live',
	FACTOR_PUSHED: 'New Factor Go Live',

	REPORT_PUSHED: 'New Report Go Live',

	GROUP_JOINED: 'Group Joined',
	GROUP_LEFT: 'Group Left',

	SPACE_JOINED: 'Space Joined',
	SPACE_LEFT: 'Space Left',

	SUBSCRIBE_REPORT_CHANGED: 'Subscribed Report Definition Changed',
	SUBSCRIBE_REPORT_DELETED: 'Subscribed Report Deleted'
};
const CategoryColor = (category: ConsoleNotificationCategory) => {
	switch (category) {
		case ConsoleNotificationCategory.CHART_TYPE_PUSHED:
			return 1;
		case ConsoleNotificationCategory.SPACE_PUSHED:
		case ConsoleNotificationCategory.TOPIC_PUSHED:
		case ConsoleNotificationCategory.FACTOR_PUSHED:
			return 2;
		case ConsoleNotificationCategory.REPORT_PUSHED:
			return 3;
		case ConsoleNotificationCategory.GROUP_JOINED:
		case ConsoleNotificationCategory.GROUP_LEFT:
		case ConsoleNotificationCategory.SPACE_JOINED:
		case ConsoleNotificationCategory.SPACE_LEFT:
			return 4;
		case ConsoleNotificationCategory.SUBSCRIBE_REPORT_CHANGED:
		case ConsoleNotificationCategory.SUBSCRIBE_REPORT_DELETED:
		default:
			return void 0;
	}
};

export const NotificationItem = (props: { data: ConsoleNotification, readable: boolean }) => {
	const { data, readable } = props;
	const { subject, category, sender, body, image, createDate } = data;

	const context = useConsoleContext();
	const [ read, setRead ] = useState(false);

	return <MessageItemContainer data-read={read}>
		<Header>
			<Category>{CategoryLabel[category]}</Category>
			<Operators>
				<ReadButton readable={readable} tooltip='Clear Notification'
				            onRead={() => setRead(true)}
				            readOne={() => context.notifications.readOne(data)}/>
			</Operators>
			<Sender>
				<UserAvatar name={sender} showTooltip={true}/>
			</Sender>
			<MessageItemSubject>{subject}</MessageItemSubject>
		</Header>
		<Body body={body} createDate={createDate} image={image} color-type={CategoryColor(category)}/>
	</MessageItemContainer>;
};