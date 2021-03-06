import dayjs from 'dayjs';
import { DataColumnType } from '../../../../data/types';
import { AggregateResult, AggregatorParameters, IndicatorAggregator } from '../../types';

export const maximum = (params: AggregatorParameters): AggregateResult => {
	const { items, indicator, keyCount } = params;

	const final = items.reduce((final, item) => {
		if (indicator.column?.type === DataColumnType.NUMERIC) {
			return ((final || 0) - (item[keyCount] || 0) < 0) ? (item[keyCount] || 0) : (final || 0);
		} else {
			// date, datetime, time
			if (final == null) {
				return item[keyCount];
			} else if (item[keyCount] == null) {
				return final;
			} else {
				const a = dayjs(final);
				const b = dayjs(item[keyCount]);
				return a.isBefore(b) ? item[keyCount] : final;
			}
		}
	}, items[0][keyCount]);
	return { value: final, label: `Max: ${final}`, aggregator: IndicatorAggregator.MAXIMUM };
};
