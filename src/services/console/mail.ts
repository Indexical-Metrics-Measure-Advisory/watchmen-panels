import { ConsoleMails } from './types';

export interface MailResponse {
	mails: ConsoleMails;
	allLoaded: boolean;
}

export const listUnreadMails = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<MailResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				mails: [
					{
						id: '1',
						subject: 'Hello there.',
						body: 'Welcome to group "Oklahoma", guess which one here?',
						sender: 'Damon Lindelof',
						createDate: '2020/10/05 17:45:37'
					}
				],
				allLoaded: true
			});
		}, 1000);
	});
};
export const listReadMails = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<MailResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				mails: [],
				allLoaded: true
			});
		}, 3000);
	});
};

export const getLatestMails = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<ConsoleMails> => {
	return [];
};

export const updateMailsAsRead = async (mails: ConsoleMails): Promise<void> => {
	return;
};