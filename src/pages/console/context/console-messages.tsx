import { EventEmitter } from "events";
import { useReducer, useState } from 'react';
import { ConsoleMessage } from '../../../services/console/types';

export type MessageEvent = string;

export interface ConsoleMessagesStorage<M extends ConsoleMessage> {
	initialized: boolean;
	unread: Array<M>;
	allUnreadLoaded: boolean;
	read: Array<M>;
	allReadLoaded: boolean;
}

const distinct = <T extends ConsoleMessage>(messages: Array<T>, exclusive: Array<T>): Array<T> => {
	const ids = new Set<string>(messages.map(message => message.id));
	const exclusiveIds = new Set<string>(exclusive.map(message => message.id));
	return messages
		.sort((n1, n2) => n1.createDate.localeCompare(n2.createDate))
		.reverse()
		.filter(message => {
			if (ids.has(message.id)) {
				ids.delete(message.id);
				return !exclusiveIds.has(message.id);
			} else {
				return false;
			}
		});
};

export interface ConsoleMessagesUsable<M extends ConsoleMessage, E extends MessageEvent> {
	readAll: () => void;
	readOne: (message: M) => void;
	fetchUnread: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchRead: (options?: { pageSize?: number, endTime?: string }) => Promise<void>;
	fetchLatest: () => Promise<void>;
	on: (event: E, listener: (...args: Array<any>) => void) => void;
	off: (event: E, listener: (...args: Array<any>) => void) => void;
}

export const useMessages = <M extends ConsoleMessage, E extends MessageEvent>(options: {
	updateAsRead: (messages: Array<M>) => Promise<void>;
	listReadMessages: (options?: { endTime?: string; pageSize?: number; }) => Promise<{ list: Array<M>, allLoaded: boolean }>;
	listUnreadMessages: (options?: { endTime?: string; pageSize?: number; }) => Promise<{ list: Array<M>, allLoaded: boolean }>;
	getLatestMessages: (options?: { endTime?: string; pageSize?: number; }) => Promise<Array<M>>;
	typeStr: string;
	latestArrivedEvent: E
}): ConsoleMessagesStorage<M> & ConsoleMessagesUsable<M, E> => {
	const {
		updateAsRead, listReadMessages, listUnreadMessages, getLatestMessages,
		typeStr, latestArrivedEvent
	} = options;

	const [ emitter ] = useState(new EventEmitter());
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ state ] = useState<ConsoleMessagesStorage<M>>({
		initialized: false,
		unread: [],
		allUnreadLoaded: false,
		read: [],
		allReadLoaded: false
	});
	const mergeToState = (newData: Partial<ConsoleMessagesStorage<M>>) => {
		// @ts-ignore
		Object.keys(newData).forEach(key => state[key] = newData[key]);
		forceUpdate();
	};

	const readAll = async () => {
		if (state.unread.length !== 0) {
			const unread = state.unread;
			const read = distinct([ ...state.read, ...unread ], []);
			mergeToState({ unread: [], read });
			await updateAsRead(unread);
		}
	};
	const readOne = async (message: M) => {
		const unread = state.unread.filter(n => n !== message);
		const read = distinct([ ...state.read, message ], []);
		mergeToState({ read, unread });
		await updateAsRead([ message ]);
	};

	const fetchRead = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		try {
			const { list, allLoaded } = await listReadMessages({ pageSize, endTime });
			mergeToState({
				read: distinct([ ...state.read, ...list ], state.unread),
				allReadLoaded: allLoaded
			});
		} catch (e) {
			console.groupCollapsed(`%cError on fetch read ${typeStr}.`, 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const fetchUnread = async (options?: { pageSize?: number, endTime?: string }) => {
		const { pageSize = 30, endTime } = options || {};

		try {
			const { list, allLoaded } = await listUnreadMessages({ pageSize, endTime });
			mergeToState({
				unread: distinct([ ...state.unread, ...list ], state.read),
				allUnreadLoaded: allLoaded
			});
		} catch (e) {
			console.groupCollapsed(`%cError on fetch unread ${typeStr}.`, 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const fetchLatest = async (initialized: boolean = true) => {
		try {
			const latest = await getLatestMessages();
			if (latest.length !== 0) {
				mergeToState({
					initialized,
					unread: distinct([ ...state.unread, ...latest ], state.read)
				});
				emitter.emit(latestArrivedEvent, latest[0]);
			}
		} catch (e) {
			console.groupCollapsed(`%cError on fetch latest ${typeStr}.`, 'color:rgb(251,71,71)');
			console.error(e);
			console.groupEnd();
		}
	};
	const on = (event: E, listener: (...args: Array<any>) => void) => emitter.on(event, listener);
	const off = (event: E, listener: (...args: Array<any>) => void) => emitter.off(event, listener);

	return {
		...state,
		readAll,
		readOne,
		fetchRead,
		fetchUnread,
		fetchLatest,
		on,
		off
	};
};