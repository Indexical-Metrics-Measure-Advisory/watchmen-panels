import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';
import { Notification, NotificationCategory } from '../../../services/console/types';
import { UserAvatar } from '../component/user-avatar';

const Container = styled.div.attrs({
	'data-widget': 'console-notification-item'
})`
	display: flex;
	flex-direction: column;
	border-radius: calc(var(--border-radius));
	overflow: hidden;
	margin-top: var(--margin);
    box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.06);
    transition: all 300ms ease-in-out;
    &:hover {
    	box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.2)
    }
`;
const Header = styled.div`
    border-bottom: var(--border);
    margin-bottom: -1px;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    grid-column-gap: calc(var(--margin) / 2);
    grid-row-gap: calc(var(--margin) / 4);
    align-items: center;
    padding: calc(var(--margin) / 3) calc(var(--margin) / 2) calc(var(--margin) / 4);
    background-color: rgba(255,255,255,0.08);
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

export const NotificationItem = (props: { data: Notification }) => {
	const { data: { subject, category, sender, body, image, createDate } } = props;

	return <Container>
		<Header>
			<Category>{CategoryLabel[category]}</Category>
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