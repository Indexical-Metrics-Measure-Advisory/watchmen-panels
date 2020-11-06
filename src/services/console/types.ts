export enum NotificationCategory {
	CHART_TYPE_PUSHED = 'CHART_TYPE_PUSHED',

	SPACE_PUSHED = 'SPACE_PUSHED',
	TOPIC_PUSHED = 'TOPIC_PUSHED',
	FACTOR_PUSHED = 'FACTOR_PUSHED',
	INDICATOR_PUSHED = 'INDICATOR_PUSHED',

	REPORT_PUSHED = 'REPORT_PUSHED',
	CHART_PUSHED = 'CHART_PUSHED',

	GROUP_JOINED = 'GROUP_JOINED',
	GROUP_LEFT = 'GROUP_LEFT',

	SPACE_JOINED = 'SPACE_JOINED',
	SPACE_LEFT = 'SPACE_LEFT',

	SUBSCRIBE_REPORT_CHANGED = 'SUBSCRIBE_REPORT_CHANGED',
	SUBSCRIBE_REPORT_DELETED = 'SUBSCRIBE_REPORT_DELETED',
	SUBSCRIBE_CHART_CHANGED = 'SUBSCRIBE_CHART_CHANGED',
	SUBSCRIBE_CHART_DELETED = 'SUBSCRIBE_CHART_DELETED'
}

export interface Notification {
	id: string;
	subject: string;
	category: NotificationCategory;
	body: string;
	image?: string;
	sender: string;
	createDate: string;
}

export type Notifications = Array<Notification>;

export interface Mail {
	id: string;
	subject: string;
	body: string;
	image?: string;
	sender: string;
	createDate: string;
}

export type Mails = Array<Mail>;