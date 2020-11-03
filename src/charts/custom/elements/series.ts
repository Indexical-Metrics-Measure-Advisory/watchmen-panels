import { DataColumnType, DataSet } from '../../../data/types';
import { BaseColors24 } from '../../color-theme';
import { ChartSettingsDimension, ChartSettingsIndicator, SeriesData, SeriesDataItem } from '../types';
import { aggregate, findAggregator } from './aggregator';
import { getAxisValue } from './axis';
import { getDimensionValue } from './dimension';
import { getIndicatorLabel } from './indicator';

/**
 * all dimensions are on x-axis,<br>
 * build series data by indicator.
 */
export const getSeriesDataWhenDimensionsOnXAxis = (options: {
	data: DataSet,
	indicator: ChartSettingsIndicator,
	dimensions: Array<ChartSettingsDimension>,
}): SeriesData => {
	const { data, indicator, dimensions } = options;

	const seriesData: Array<SeriesDataItem> = (data[indicator.topicName!].data || []).map(item => {
		const label = getIndicatorLabel(indicator);
		const column = indicator.column!;
		const value = item[column.name!];
		return [
			// xAxis
			getAxisValue({ data, dimensions, row: item }),
			// yAxis
			value,
			`${label}: ${value}`,
			label
		] as SeriesDataItem;
	});

	return aggregate(seriesData, indicator);
};

/**
 * Given dimensions have and must have 2 elements. The first is for x-axis, and the second is for y-axis<br>
 * build series data by indicator.
 */
export const getSeriesDataWhen2DimensionsOnXYAxis = (options: {
	data: DataSet,
	indicator: ChartSettingsIndicator,
	dimensions: Array<ChartSettingsDimension>,
}): SeriesData => {
	const { data, indicator, dimensions } = options;

	const seriesData: Array<SeriesDataItem> = (data[indicator.topicName!].data || []).map(item => {
		const label = getIndicatorLabel(indicator);
		const column = indicator.column!;
		const value = item[column.name!];
		return [
			// xAxis
			getDimensionValue(item, dimensions[0]),
			// yAxis
			getDimensionValue(item, dimensions[1]),
			value,
			`${label}: ${value}`,
			label
		] as SeriesDataItem;
	});
	return aggregate(seriesData, indicator, 2);
};

export const getSeriesDataAsTree = (options: {
	data: DataSet,
	indicator: ChartSettingsIndicator,
	dimensions: Array<ChartSettingsDimension>,
}): SeriesData => {
	const { data, indicator, dimensions } = options;

	const parsed = (data[indicator.topicName!].data || []).map(item => {
		const label = getIndicatorLabel(indicator);
		const column = indicator.column!;
		const value = item[column.name!];
		return {
			name: label,
			value,
			groups: dimensions.map(dimension => {
				return `${getDimensionValue(item, dimension)}`;
			})
		};
	});

	let colorIndex = 0;
	const topMap: Map<string, any> = new Map();
	const allMap: Map<string, any> = new Map();
	const suspectedMap: Map<string, { name: string, value: number, children?: Array<{ value: number }> }> = new Map();
	parsed.forEach(item => {
		const { name, value, groups } = item;
		// build group tree
		const parentKey = groups.reduce((key, group) => {
			const parentKey = key;
			if (key) {
				key = `${key},${group}`;
				const exists = allMap.get(key);
				if (!exists) {
					const me = {
						name: group,
						children: [],
						itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
					};
					allMap.set(key, me);
					const parent = allMap.get(parentKey);
					parent.children.push(me);
				}
			} else {
				// first level
				key = group;
				const exists = topMap.get(key);
				if (!exists) {
					const me = {
						name: group,
						children: [],
						itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
					};
					allMap.set(key, me);
					topMap.set(key, me);
				}
			}
			return key;
		}, '');

		const parent = allMap.get(parentKey);
		suspectedMap.set(parentKey, parent);
		if (indicator.column?.type !== DataColumnType.NUMERIC) {
			// not a number, use value as name, and set value to 1
			parent.children.push({
				name: value,
				value: 1,
				itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
			});
		} else {
			// numeric value can be aggregate
			parent.children.push({
				name,
				value,
				itemStyle: { color: BaseColors24[colorIndex++ % BaseColors24.length] }
			});
		}
	});

	const func = findAggregator(indicator);
	if (func) {
		const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format;
		Array.from(suspectedMap.values()).forEach(node => {
			const { value } = func({
				items: (node.children || []).map(item => {
					return [ 'group', item.value ];
				}),
				indicator,
				keyCount: 1
			});
			node.value = Math.round((+value + 'e2') as unknown as number) / Math.pow(10, 2);
			node.name = `${node.name}: ${format(node.value)}`;
			delete node.children;
		});
	}

	return Array.from(topMap.values());
};
