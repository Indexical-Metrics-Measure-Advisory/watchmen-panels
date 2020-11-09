import React, { useState } from 'react';
import styled from 'styled-components';
import { Notification, NotificationCategory } from '../../../../services/console/types';
import { UserAvatar } from '../../component/user-avatar';
import { useConsoleContext } from '../../context/console-context';
import {
	ItemBody,
	MessageItemContainer,
	MessageItemHeader,
	MessageItemSender,
	MessageItemSubject
} from '../common/item';
import { Operators } from '../common/operators';
import { ReadButton } from '../common/read-button';

const Header = styled(MessageItemHeader)`
    grid-template-rows: auto 1fr;
    grid-row-gap: calc(var(--margin) / 4);
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

	return <MessageItemContainer data-read={read}>
		<Header>
			<Category>{CategoryLabel[category]}</Category>
			<Operators>
				<ReadButton readable={readable} tooltip='Clear Notification'
				            onRead={() => setRead(true)}
				            readOne={() => context.notifications.readOne(data)}/>
			</Operators>
			<MessageItemSender>
				<UserAvatar name={sender} showTooltip={true}/>
			</MessageItemSender>
			<MessageItemSubject>{subject}</MessageItemSubject>
		</Header>
		<Body body={body} createDate={createDate} image={image} color-type={CategoryColor(category)}/>
	</MessageItemContainer>;
};