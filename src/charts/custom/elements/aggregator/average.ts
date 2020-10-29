import { AggregateResult, AggregatorParameters } from '../../types';

export const average = (params: AggregatorParameters): AggregateResult => {
	const { items, keyCount } = params;
	const final = items.reduce((final, item) => (final || 0) + (item[keyCount] || 0), 0) / items.length;
	return { value: final, label: `Average: ${final}` };
};
