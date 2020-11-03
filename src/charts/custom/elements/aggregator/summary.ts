import { AggregateResult, AggregatorParameters, IndicatorAggregator } from '../../types';

export const summary = (params: AggregatorParameters): AggregateResult => {
	const { items, keyCount } = params;
	const final = items.reduce((final, item) => {
		return (final || 0) + (item[keyCount] || 0) * 1;
	}, 0);
	return { value: final, label: `Sum: ${final}`, aggregator: IndicatorAggregator.MINIMUM };
};
