import { Aggregator, ChartSettingsIndicator, IndicatorAggregator, SeriesData, SeriesDataItem } from '../../types';
import { average } from './average';
import { count } from './count';
import { maximum } from './maximum';
import { median } from './median';
import { minimum } from './minimum';
import { summary } from './summary';

export const findAggregator = (indicator: ChartSettingsIndicator): Aggregator | null => {
	switch (indicator.aggregator) {
		case IndicatorAggregator.COUNT:
			return count;
		case IndicatorAggregator.SUMMARY:
			return summary;
		case IndicatorAggregator.AVERAGE:
			return average;
		case IndicatorAggregator.MEDIAN:
			return median;
		case IndicatorAggregator.MAXIMUM:
			return maximum;
		case IndicatorAggregator.MINIMUM:
			return minimum;
		case IndicatorAggregator.NONE:
		default:
			return null;
	}
};

export const aggregate = (seriesData: SeriesData, indicator: ChartSettingsIndicator, keyCount: number = 1): Array<SeriesDataItem> => {
	const func = findAggregator(indicator);
	if (func == null) {
		return seriesData;
	} else {
		// simulate a keys array
		const keys = new Array(keyCount).fill(1);

		const map = seriesData.reduce((map, item) => {
			// build string key, key values concatenated by comma
			const key = keys.map((v, index) => item[index]).map(v => v || '').join(',');
			// group by string key
			let exists: Array<SeriesDataItem> | undefined = map.get(key);
			if (!exists) {
				exists = [];
				map.set(key, exists);
			}
			exists.push(item);
			return map;
		}, new Map<string, Array<SeriesDataItem>>());

		// aggregate each group,
		return Array.from(map.values()).reduce((final, group) => {
			const aggregated: SeriesDataItem = [];
			// copy value from the first item to aggregated item
			group[0].forEach((v, index) => aggregated[index] = v);

			const { value, label } = func({ items: group, indicator, keyCount });
			aggregated[keyCount] = value;
			aggregated[keyCount + 1] = label;
			final.push(aggregated);
			return final;
		}, [] as Array<SeriesDataItem>);
	}
};
