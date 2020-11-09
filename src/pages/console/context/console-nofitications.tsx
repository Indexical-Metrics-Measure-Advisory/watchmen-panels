import { EventEmitter } from 'events';
import { useEffect, useReducer, useState } from 'react';
import {
	getLatestNotifications,
	listReadNotifications,
	listUnreadNotifications,
	updateNotificationsAsRead
} from '../../../services/console/notification';
import { Notification, Notifications } from '../../../services/console/types';

export enum NotificationEvent {
	LATEST_RECEIVED = 'latest-received'
}

export interface ConsoleNotifications {
	unread: Notifications;
	allUnreadLoaded: boolean;
	read: Notifications;
	allReadLoaded: boolean;
}

export interface ConsoleNotificationsFunctions {
	readAll: () => void;
	readOne: (notification: Notification) => void;
	fetchUnread: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchRead: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchLatest: () => Promise<void>;
	on: (event: NotificationEvent, listener: (...args: Array<any>) => void) => void;
	off: (event: NotificationEvent, listener: (...args: Array<any>) => void) => void;
}

const distinct = (notifications: Notifications) => {
	const ids = new Set<string>(notifications.map(notification => notification.id));
	return notifications
		.sort((n1, n2) => n1.createDate.localeCompare(n2.createDate))
		.reverse()
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
	const [ emitter ] = useState(new EventEmitter());
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ notifications ] = useState<ConsoleNotifications>({
		unread: [],
		allUnreadLoaded: false,
		read: [],
		allReadLoaded: false
	});
	const mergeNotifications = (newData: Partial<ConsoleNotifications>) => {
		Object.keys(newData).forEach((key) => {
			// @ts-ignore
			notifications[key] = newData[key];
		});
		forceUpdate();
	};

	const readAll = async () => {
		if (notifications.unread.length !== 0) {
			const unread = notifications.unread;
			const read = distinct([ ...notifications.read, ...unread ]);
			mergeNotifications({ unread: [], read });
			await updateNotificationsAsRead(unread);
		}
	};
	const readOne = async (notification: Notification) => {
		const unread = notifications.unread.filter(n => n !== notification);
		const read = distinct([ ...notifications.read, notification ]);
		mergeNotifications({ read, unread });
		await updateNotificationsAsRead([ notification ]);
	};

	const fetchRead = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { notifications: list, allLoaded } = await listReadNotifications({ pageSize, endTime });
		mergeNotifications({
			read: distinct([ ...notifications.read, ...list ]),
			allReadLoaded: allLoaded
		});
	};
	const fetchUnread = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { notifications: list, allLoaded } = await listUnreadNotifications({ pageSize, endTime });
		mergeNotifications({
			unread: distinct([ ...notifications.unread, ...list ]),
			allUnreadLoaded: allLoaded
		});
	};
	const fetchLatest = async () => {
		try {
			const latest = await getLatestNotifications();
			if (latest.length !== 0) {
				mergeNotifications({
					unread: distinct([ ...notifications.unread, ...latest ])
				});
				emitter.emit(NotificationEvent.LATEST_RECEIVED, latest[0]);
			}
		} catch (e) {
			console.groupCollapsed('%cError on fetch latest notifications.', 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const on = (event: NotificationEvent, listener: (...args: Array<any>) => void) => emitter.on(event, listener);
	const off = (event: NotificationEvent, listener: (...args: Array<any>) => void) => emitter.off(event, listener);

	// TODO simulate data for demo purpose
	useEffect(() => {
		setTimeout(() => fetchLatest(), 30000);
		// eslint-disable-next-line
	}, [ 0 ]);

	return {
		...notifications,
		readAll,
		readOne,
		fetchRead,
		fetchUnread,
		fetchLatest,
		on,
		off
	};
};