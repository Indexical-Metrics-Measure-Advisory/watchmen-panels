import { AggregateResult, AggregatorParameters, IndicatorAggregator, SeriesDataItem } from '../../types';

export const median = (params: AggregatorParameters): AggregateResult => {
	const { items, keyCount } = params;

	const sorted = items.sort((a: SeriesDataItem, b: SeriesDataItem): number => {
		if (a[keyCount] == null) {
			return b[keyCount] == null ? 0 : -1;
		} else if (b[keyCount] == null) {
			return 1;
		} else {
			const minus = (a[keyCount] || 0) - (b[keyCount] || 0);
			if (isNaN(minus)) {
				const x = (a[keyCount] || '').toString();
				const y = (b[keyCount] || '').toString();
				return x.localeCompare(y);
			} else {
				return minus * -1;
			}
		}
	});
	let final;
	if (sorted.length % 2 === 1) {
		final = sorted[Math.floor(sorted.length / 2)];
	} else {
		const one = sorted[sorted.length / 2 - 1];
		const another = sorted[sorted.length / 2];
		// to avoid compile warning here, use a variable instead of constant
		const coefficient = 1;
		final = ((one as unknown as number * coefficient) + (another as unknown as number * coefficient)) / 2;
	}
	return { value: final, label: `Median: ${final}`, aggregator: IndicatorAggregator.MEDIAN };
};
