import { getLatestMails, listReadMails, listUnreadMails, updateMailsAsRead } from '../../../services/console/mail';
import { ConsoleMail } from '../../../services/console/types';
import { ConsoleMessagesStorage, ConsoleMessagesUsable, useMessages } from './console-messages';

export enum ConsoleMailEvent {
	LATEST_RECEIVED = 'latest-mail-received'
}

export interface ConsoleMailsStorage extends ConsoleMessagesStorage<ConsoleMail> {
}

export interface ConsoleMailsUsable extends ConsoleMessagesUsable<ConsoleMail, ConsoleMailEvent> {
}

export const useConsoleMails = () => {
	return useMessages({
		updateAsRead: updateMailsAsRead,
		listReadMessages: async (options?: {
			endTime?: string;
			pageSize?: number;
		}) => {
			const response = await listReadMails(options);
			return {
				list: response.mails,
				allLoaded: response.allLoaded
			};
		},
		listUnreadMessages: async (options?: {
			endTime?: string;
			pageSize?: number;
		}) => {
			const response = await listUnreadMails(options);
			return {
				list: response.mails,
				allLoaded: response.allLoaded
			};
		},
		getLatestMessages: getLatestMails,
		typeStr: 'mails',
		latestArrivedEvent: ConsoleMailEvent.LATEST_RECEIVED
	});
};
