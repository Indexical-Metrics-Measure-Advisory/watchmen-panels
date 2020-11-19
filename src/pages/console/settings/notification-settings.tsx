import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from "react";
import styled from "styled-components";
import { ConsoleNotificationCategory } from '../../../services/console/types';
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { useConsoleContext } from '../context/console-context';
import { Frequency, FrequencyOptions } from '../context/console-settings';
import { DropdownItemBody, ItemContainer, ItemTitle } from './components';

const NotificationTypeList = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: calc(var(--margin) / 2);
	> div {
		display: flex;
		height: 48px;
		border-bottom: var(--border);
		&:first-child {
			font-family: var(--console-title-font-family);
			font-weight: var(--font-demi-bold);
			border-width: calc(var(--border-width) * 2);
		}
		> div:first-child {
			display: flex;
			flex-grow: 1;
			align-items: center;
		}
		> div:last-child {
			display: flex;
			align-items: center;
			width: 180px;
			&[data-checked=true] {
				> svg {
					opacity: 1;
					color: var(--console-primary-color);
				}
			}
			> svg {
				margin-left: calc(var(--margin) / 3);
				font-size: 1.4em;
				opacity: 0.6;
				cursor: pointer;
				transition: all 300ms ease-in-out;
			}
		}
	}
`;

const Notifications = [
	{ type: ConsoleNotificationCategory.CHART_TYPE_PUSHED, label: 'New chart type published.' },

	{ type: ConsoleNotificationCategory.SPACE_PUSHED, label: 'New space published.' },
	{ type: ConsoleNotificationCategory.TOPIC_PUSHED, label: 'New topic published' },
	{ type: ConsoleNotificationCategory.FACTOR_PUSHED, label: 'New factor published.' },

	{ type: ConsoleNotificationCategory.REPORT_PUSHED, label: 'New report published.' },

	{ type: ConsoleNotificationCategory.GROUP_JOINED, label: 'Someone joined your group.' },
	{ type: ConsoleNotificationCategory.GROUP_LEFT, label: 'Someone left your group.' },

	{ type: ConsoleNotificationCategory.SPACE_JOINED, label: 'Someone connected space.' },
	{ type: ConsoleNotificationCategory.SPACE_LEFT, label: 'Someone disconnected space.' },

	{ type: ConsoleNotificationCategory.SUBSCRIBE_REPORT_CHANGED, label: 'Subscribed report changed.' },
	{ type: ConsoleNotificationCategory.SUBSCRIBE_REPORT_DELETED, label: 'Subscribed report deleted.' }
];

export const NotificationSettings = () => {
	const {
		settings: {
			notificationFrequency, notificationSubscriptionCategories,
			notificationFrequencyChanged, notificationCategorySubscriptionAdded, notificationCategorySubscriptionRemoved
		}
	} = useConsoleContext();
	const onToggleNotificationSubscribeClicked = (category: ConsoleNotificationCategory) => () => {
		if (notificationSubscriptionCategories.includes(category)) {
			notificationCategorySubscriptionRemoved(category);
		} else {
			notificationCategorySubscriptionAdded(category);
		}
	};
	const onFrequencyChanged = async (option: DropdownOption) => {
		notificationFrequencyChanged(option.value as Frequency);
	};

	return <Fragment>
		<ItemContainer>
			<ItemTitle>Subscribed Notifications</ItemTitle>
			<NotificationTypeList>
				<div>
					<div>Notification Type</div>
					<div>Subscribe?</div>
				</div>
				{Notifications.map(notification => {
					const checked = notificationSubscriptionCategories.some(n => n === notification.type);
					return <div key={notification.type}>
						<div>{notification.label}</div>
						<div data-checked={checked}>
							<FontAwesomeIcon icon={faCheck}
							                 onClick={onToggleNotificationSubscribeClicked(notification.type)}/>
						</div>
					</div>;
				})}
			</NotificationTypeList>
		</ItemContainer>
		<ItemContainer>
			<ItemTitle>Notification Check Frequency</ItemTitle>
			<DropdownItemBody>
				<span>Every</span>
				<Dropdown options={FrequencyOptions} onChange={onFrequencyChanged} value={notificationFrequency}/>
			</DropdownItemBody>
		</ItemContainer>
	</Fragment>;
};