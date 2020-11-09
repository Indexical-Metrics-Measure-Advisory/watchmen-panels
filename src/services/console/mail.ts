import dayjs from 'dayjs';
import { Mail, Mails } from './types';

export interface MailResponse {
	mails: Mails;
	allLoaded: boolean;
}

export const listUnreadMails = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<MailResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				mails: [
					{
						id: '5',
						subject: 'Awesome chart for investigating customers distribution.',
						body: 'A distribution diagram of customers of age bracket and place of residence.',
						sender: 'Damon Lindelof',
						createDate: '2020/11/05 20:18:19'
					},
					{
						id: '4',
						subject: 'Scatter support dynamic effect now.',
						body: 'Use dynamic effect, active your chart!',
						sender: 'Sally Jupiter',
						createDate: '2020/11/03 09:55:09'
					},
					{
						id: '3',
						subject: 'A big space for marketing digging.',
						body: 'After 3 weeks great work, the marketing space is online now.\nThanks to all involved in making this happen!\nFollow us to find more...',
						sender: 'Sally Jupiter',
						createDate: '2020/11/01 11:24:01'
					},
					{
						id: '2',
						subject: 'Jeffrey Dean Morgan left.',
						body: 'Jeffrey Dean Morgan left group "Oklahoma".',
						sender: 'Roy Raymond',
						createDate: '2020/10/14 15:42:00'
					},
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
}): Promise<Mails> => {
	return [ {
		id: '6',
		subject: 'Jeffrey Dean Morgan join us again.',
		body: 'Misoperation must be prevented on system level.',
		sender: 'Damon Lindelof',
		createDate: dayjs().format('YYYY/MM/DD HH:mm:ss')
	} as Mail ];
};

export const updateMailsAsRead = async (mails: Mails): Promise<void> => {
	return;
};