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
	notificationSubscriptionCategories: Array<ConsoleNotificationCategory>;
	mailFrequency: Frequency;
}

export interface ConsoleSettingsUsable {
	notificationFrequencyChanged: (frequency: Frequency) => void;
	notificationCategorySubscriptionAdded: (category: ConsoleNotificationCategory) => void;
	notificationCategorySubscriptionRemoved: (category: ConsoleNotificationCategory) => void;
	mailFrequencyChanged: (frequency: Frequency) => void;
}

export const useConsoleSettings = () => {
	// TODO simulate data for demo purpose
	const [ state, setState ] = useState<ConsoleSettingsStorage>({
		notificationFrequency: Frequency.MIN_15,
		notificationSubscriptionCategories: Object.keys(ConsoleNotificationCategory) as Array<ConsoleNotificationCategory>,
		mailFrequency: Frequency.MIN_30
	});

	const notificationFrequencyChanged = (frequency: Frequency) => {
		setState({ ...state, notificationFrequency: frequency });
	};
	const notificationCategorySubscriptionAdded = (category: ConsoleNotificationCategory) => {
		if (!state.notificationSubscriptionCategories.includes(category)) {
			setState({
				...state,
				notificationSubscriptionCategories: [ ...state.notificationSubscriptionCategories, category ]
			});
		}
	};
	const notificationCategorySubscriptionRemoved = (category: ConsoleNotificationCategory) => {
		if (state.notificationSubscriptionCategories.includes(category)) {
			setState({
				...state,
				notificationSubscriptionCategories: state.notificationSubscriptionCategories.filter(c => c != category)
			});
		}
	};
	const mailFrequencyChanged = (frequency: Frequency) => {
		setState({ ...state, mailFrequency: frequency });
	};

	return {
		...state,

		notificationFrequencyChanged,
		notificationCategorySubscriptionAdded,
		notificationCategorySubscriptionRemoved,

		mailFrequencyChanged
	};
};