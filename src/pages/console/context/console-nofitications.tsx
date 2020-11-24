import { useEffect } from 'react';
import {
	getLatestNotifications,
	listReadNotifications,
	listUnreadNotifications,
	updateNotificationsAsRead
} from '../../../services/console/notification';
import { ConsoleNotification } from '../../../services/console/types';
import { ConsoleMessagesStorage, ConsoleMessagesUsable, useMessages } from './console-messages';

export enum ConsoleNotificationEvent {
	LATEST_RECEIVED = 'latest-notification-received'
}

export interface ConsoleNotificationsStorage extends ConsoleMessagesStorage<ConsoleNotification> {
}

export interface ConsoleNotificationsUsable extends ConsoleMessagesUsable<ConsoleNotification, ConsoleNotificationEvent> {
}

export const useConsoleNotifications = () => {
	const notifications = useMessages<ConsoleNotification, ConsoleNotificationEvent>({
		updateAsRead: updateNotificationsAsRead,
		listReadMessages: async (options?: {
			endTime?: string;
			pageSize?: number;
		}) => {
			const response = await listReadNotifications(options);
			return {
				list: response.notifications,
				allLoaded: response.allLoaded
			};
		},
		listUnreadMessages: async (options?: {
			endTime?: string;
			pageSize?: number;
		}) => {
			const response = await listUnreadNotifications(options);
			return {
				list: response.notifications,
				allLoaded: response.allLoaded
			};
		},
		getLatestMessages: getLatestNotifications,
		typeStr: 'notifications',
		latestArrivedEvent: ConsoleNotificationEvent.LATEST_RECEIVED
	});

	// TODO simulate data for demo purpose
	useEffect(() => {
		if (!notifications.initialized) {
			setTimeout(async () => {
				await notifications.fetchLatest();
			}, 30000);
		}
		// eslint-disable-next-line
	}, [ notifications.initialized ]);

	return notifications;
};
