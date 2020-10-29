import dayjs from 'dayjs';
import { DataColumnType } from '../../../../data/types';
import { AggregateResult, AggregatorParameters } from '../../types';

export const minimum = (params: AggregatorParameters): AggregateResult => {
	const { items, indicator, keyCount } = params;

	const final = items.reduce((final, item) => {
		if (indicator.column?.type === DataColumnType.NUMERIC) {
			return ((final || 0) - (item[keyCount] || 0) > 0) ? (item[keyCount] || 0) : (final || 0);
		} else {
			// date, datetime, time
			if (final == null) {
				return item[keyCount];
			} else if (item[keyCount] == null) {
				return final;
			} else {
				const a = dayjs(final);
				const b = dayjs(item[keyCount]);
				return a.isBefore(b) ? final : item[keyCount];
			}
		}
	}, items[0][keyCount]);
	return { value: final, label: `Min: ${final}` };
};
