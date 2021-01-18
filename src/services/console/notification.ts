import dayjs from "dayjs";
import { ConsoleNotification, ConsoleNotificationCategory, ConsoleNotifications } from "./types";

export interface NotificationResponse {
	notifications: ConsoleNotifications;
	allLoaded: boolean;
}

export const listUnreadNotifications = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [
					{
						id: "5",
						subject: "Awesome report for investigating customers distribution.",
						category: ConsoleNotificationCategory.REPORT_PUSHED,
						body: "A distribution diagram of customers of age bracket and place of residence.",
						sender: "Damon Lindelof",
						createDate: "2020/11/05 20:18:19",
					},
					{
						id: "4",
						subject: "Scatter support dynamic effect now.",
						category: ConsoleNotificationCategory.CHART_TYPE_PUSHED,
						body: "Use dynamic effect, active your chart!",
						sender: "Sally Jupiter",
						createDate: "2020/11/03 09:55:09",
					},
					{
						id: "3",
						subject: "A big space for marketing digging.",
						category: ConsoleNotificationCategory.SPACE_PUSHED,
						body:
							"After 3 weeks great work, the marketing space is online now.\nThanks to all involved in making this happen!\nFollow us to find more...",
						sender: "Sally Jupiter",
						createDate: "2020/11/01 11:24:01",
					},
					{
						id: "2",
						subject: "Jeffrey Dean Morgan left.",
						category: ConsoleNotificationCategory.GROUP_LEFT,
						body: 'Jeffrey Dean Morgan left group "Oklahoma".',
						sender: "Roy Raymond",
						createDate: "2020/10/14 15:42:00",
					},
					{
						id: "1",
						subject: "Hello there.",
						category: ConsoleNotificationCategory.GROUP_JOINED,
						body: 'Welcome to group "Oklahoma", guess which one here?',
						sender: "Damon Lindelof",
						createDate: "2020/10/05 17:45:37",
					},
				],
				allLoaded: true,
			});
		}, 1000);
	});
};
export const listReadNotifications = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [],
				allLoaded: true,
			});
		}, 3000);
	});
};

export const getLatestNotifications = async (options?: {
	endTime?: string;
	pageSize?: number;
}): Promise<ConsoleNotifications> => {
	return [
		{
			id: "6",
			subject: "Jeffrey Dean Morgan join us again.",
			category: ConsoleNotificationCategory.GROUP_JOINED,
			body: "Misoperation must be prevented on system level.",
			sender: "Damon Lindelof",
			createDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		} as ConsoleNotification,
	];
};

export const updateNotificationsAsRead = async (notifications: ConsoleNotifications): Promise<void> => {
	return;
};
