import { useState } from 'react';
import { listReadNotifications, listUnreadNotifications } from '../../../services/console/notification';
import { Notifications } from '../../../services/console/types';

export interface ConsoleNotifications {
	unread: Notifications;
	allUnreadLoaded: boolean;
	read: Notifications;
	allReadLoaded: boolean;
}

export interface ConsoleNotificationsFunctions {
	readAll: () => void;
	fetchUnread: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchRead: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
}

const distinct = (nofitications: Notifications) => {
	const ids = new Set<string>(nofitications.map(notification => notification.id));
	return nofitications
		.sort((n1, n2) => 0 - n1.createDate.localeCompare(n2.createDate))
		.filter(notification => {
			if (ids.has(notification.id)) {
				ids.delete(notification.id);
				return true;
			} else {
				return false;
			}
		});
};

export const useNotifications = () => {
	const [ notifications, setNotifications ] = useState<ConsoleNotifications>({
		unread: [],
		allUnreadLoaded: false,
		read: [],
		allReadLoaded: false
	});

	const readAllNotifications = () => {
		if (notifications.unread.length !== 0) {
			const read = distinct([ ...notifications.read, ...notifications.unread ]);
			setNotifications({ ...notifications, unread: [], read });
		}
	};

	const fetchRead = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { notifications: list, allLoaded } = await listReadNotifications({ pageSize, endTime });
		setNotifications({
			...notifications,
			read: distinct([ ...notifications.read, ...list ]),
			allReadLoaded: allLoaded
		});
	};
	const fetchUnread = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { notifications: list, allLoaded } = await listUnreadNotifications({ pageSize, endTime });
		setNotifications({
			...notifications,
			unread: distinct([ ...notifications.unread, ...list ]),
			allUnreadLoaded: allLoaded
		});
	};

	return {
		...notifications,
		readAll: readAllNotifications,
		fetchRead,
		fetchUnread
	};
};