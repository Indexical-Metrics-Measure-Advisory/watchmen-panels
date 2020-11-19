import { useState } from 'react';
import { ConsoleNotificationCategory } from '../../../services/console/types';

export enum Frequency {
	MIN_5 = '1',
	MIN_10 = '2',
	MIN_15 = '3',
	MIN_20 = '4',
	MIN_30 = '5',
	HOUR_1 = '6'
}

export const FrequencyOptions = [
	{ value: Frequency.MIN_5, label: '5 Minutes' },
	{ value: Frequency.MIN_10, label: '10 Minutes' },
	{ value: Frequency.MIN_15, label: '15 Minutes' },
	{ value: Frequency.MIN_20, label: '20 Minutes' },
	{ value: Frequency.MIN_30, label: '30 Minutes' },
	{ value: Frequency.HOUR_1, label: '1 Hours' }
];

export interface ConsoleSettingsStorage {
	notificationFrequency: Frequency;
	notificationCategories: Array<ConsoleNotificationCategory>;
	mailFrequency: Frequency;
}

export const useConsoleSettings = () => {
	// TODO simulate data for demo purpose
	const [ state ] = useState<ConsoleSettingsStorage>({
		notificationFrequency: Frequency.MIN_15,
		notificationCategories: Object.keys(ConsoleNotificationCategory) as Array<ConsoleNotificationCategory>,
		mailFrequency: Frequency.MIN_30
	});

	return {
		...state
	};
};