import { EventEmitter } from 'events';
import { useReducer, useState } from 'react';
import { getLatestMails, listReadMails, listUnreadMails, updateMailsAsRead } from '../../../services/console/mail';
import { Mail, Mails } from '../../../services/console/types';

export enum MailEvent {
	LATEST_RECEIVED = 'latest-received'
}

export interface ConsoleMails {
	unread: Mails;
	allUnreadLoaded: boolean;
	read: Mails;
	allReadLoaded: boolean;
}

export interface ConsoleMailsFunctions {
	readAll: () => void;
	readOne: (mail: Mail) => void;
	fetchUnread: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchRead: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchLatest: () => Promise<void>;
	on: (event: MailEvent, listener: (...args: Array<any>) => void) => void;
	off: (event: MailEvent, listener: (...args: Array<any>) => void) => void;
}

const distinct = (mails: Mails) => {
	const ids = new Set<string>(mails.map(mail => mail.id));
	return mails
		.sort((n1, n2) => n1.createDate.localeCompare(n2.createDate))
		.reverse()
		.filter(mail => {
			if (ids.has(mail.id)) {
				ids.delete(mail.id);
				return true;
			} else {
				return false;
			}
		});
};

export const useMails = () => {
	const [ emitter ] = useState(new EventEmitter());
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ mails ] = useState<ConsoleMails>({
		unread: [],
		allUnreadLoaded: false,
		read: [],
		allReadLoaded: false
	});
	const mergeMails = (newData: Partial<ConsoleMails>) => {
		Object.keys(newData).forEach((key) => {
			// @ts-ignore
			mails[key] = newData[key];
		});
		forceUpdate();
	};

	const readAll = async () => {
		if (mails.unread.length !== 0) {
			const unread = mails.unread;
			const read = distinct([ ...mails.read, ...unread ]);
			mergeMails({ unread: [], read });
			await updateMailsAsRead(unread);
		}
	};
	const readOne = async (mail: Mail) => {
		const unread = mails.unread.filter(n => n !== mail);
		const read = distinct([ ...mails.read, mail ]);
		mergeMails({ read, unread });
		await updateMailsAsRead([ mail ]);
	};

	const fetchRead = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { mails: list, allLoaded } = await listReadMails({ pageSize, endTime });
		mergeMails({
			read: distinct([ ...mails.read, ...list ]),
			allReadLoaded: allLoaded
		});
	};
	const fetchUnread = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		const { mails: list, allLoaded } = await listUnreadMails({ pageSize, endTime });
		mergeMails({
			unread: distinct([ ...mails.unread, ...list ]),
			allUnreadLoaded: allLoaded
		});
	};
	const fetchLatest = async () => {
		try {
			const latest = await getLatestMails();
			if (latest.length !== 0) {
				mergeMails({
					unread: distinct([ ...mails.unread, ...latest ])
				});
				emitter.emit(MailEvent.LATEST_RECEIVED, latest[0]);
			}
		} catch (e) {
			console.groupCollapsed('%cError on fetch latest mails.', 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const on = (event: MailEvent, listener: (...args: Array<any>) => void) => emitter.on(event, listener);
	const off = (event: MailEvent, listener: (...args: Array<any>) => void) => emitter.off(event, listener);

	return {
		...mails,
		readAll,
		readOne,
		fetchRead,
		fetchUnread,
		fetchLatest,
		on,
		off
	};
};