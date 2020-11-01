import { AggregateResult, AggregatorParameters, IndicatorAggregator } from '../../types';

export const count = (params: AggregatorParameters): AggregateResult => {
	const { items } = params;
	return { value: items.length, label: `Count: ${items.length}`, aggregator: IndicatorAggregator.COUNT };

};