import { Notifications } from './types';

export const listNewNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<Notifications> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([]);
		}, 3000);
	});
};
export const listClearedNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<Notifications> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([]);
		}, 3000);
	});
};