import { NotificationCategory, Notifications } from './types';

export interface NotificationResponse {
	notifications: Notifications;
	allLoaded: boolean;
}

export const listUnreadNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [
					{
						id: '5',
						subject: 'Awesome chart for investigating customers distribution.',
						category: NotificationCategory.CHART_PUSHED,
						body: 'A distribution diagram of customers of age bracket and place of residence.',
						sender: 'Damon Lindelof',
						createDate: '2020/11/5 20:18:19'
					},
					{
						id: '4',
						subject: 'Scatter support dynamic effect now.',
						category: NotificationCategory.CHART_TYPE_PUSHED,
						body: 'Use dynamic effect, active your chart!',
						sender: 'Sally Jupiter',
						createDate: '2020/11/3 09:55:09'
					},
					{
						id: '3',
						subject: 'A big space for marketing digging.',
						category: NotificationCategory.SPACE_PUSHED,
						body: 'After 3 weeks great work, the marketing space is online now.\nThanks to all involved in making this happen!\nFollow us to find more...',
						sender: 'Sally Jupiter',
						createDate: '2020/11/1 11:24:01'
					},
					{
						id: '2',
						subject: 'Jeffrey Dean Morgan left.',
						category: NotificationCategory.GROUP_LEFT,
						body: 'Jeffrey Dean Morgan left group "Oklahoma".',
						sender: 'Roy Raymond',
						createDate: '2020/10/14 15:42:00'
					},
					{
						id: '1',
						subject: 'Hello there.',
						category: NotificationCategory.GROUP_JOINED,
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
export const listReadNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [],
				allLoaded: true
			});
		}, 3000);
	});
};