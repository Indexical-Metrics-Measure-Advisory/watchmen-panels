import { AggregateResult, AggregatorParameters } from '../../types';

export const summary = (params: AggregatorParameters): AggregateResult => {
	const { items, keyCount } = params;
	const final = items.reduce((final, item) => (final || 0) + (item[keyCount] || 0), 0);
	return { value: final, label: `Sum: ${final}` };
};
