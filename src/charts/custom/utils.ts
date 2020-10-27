import dayjs from 'dayjs';
import { DataColumnType, DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { ChartAxisType, ChartSettingsDimension, ChartSettingsIndicator, IndicatorAggregator } from './types';

export const detectDimensionCategory = (dimension: ChartSettingsDimension): ChartAxisType => {
	switch (dimension.column?.type) {
		case DataColumnType.NUMERIC:
			return ChartAxisType.VALUE;
		case DataColumnType.DATE:
		case DataColumnType.DATETIME:
		case DataColumnType.TIME:
			return ChartAxisType.TIME;
		case DataColumnType.BOOLEAN:
		case DataColumnType.TEXT:
		case DataColumnType.UNKNOWN:
		default:
			return ChartAxisType.CATEGORY;
	}
};

export const detectIndicatorCategory = (indicator: ChartSettingsIndicator): ChartAxisType => {
	const { aggregator = IndicatorAggregator.NONE, column: { type } = { type: DataColumnType.UNKNOWN } } = indicator;
	switch (true) {
		case [ IndicatorAggregator.SUMMARY, IndicatorAggregator.MEDIAN, IndicatorAggregator.AVERAGE, IndicatorAggregator.COUNT ].includes(aggregator):
			return ChartAxisType.VALUE;
		default:
			// follow column type
			break;
	}
	switch (true) {
		case DataColumnType.NUMERIC === type:
			return ChartAxisType.VALUE;
		case [ DataColumnType.DATE, DataColumnType.DATETIME, DataColumnType.TIME ].includes(type):
			return ChartAxisType.TIME;
		case [ DataColumnType.BOOLEAN, DataColumnType.TEXT, DataColumnType.UNKNOWN ].includes(type):
		default:
			return ChartAxisType.CATEGORY;
	}
};

export const buildTitle = (options: { title?: string, theme: Theme }) => {
	const { title, theme } = options;

	if (!title) {
		return;
	}

	return {
		text: title,
		bottom: 32,
		left: '50%',
		textAlign: 'center',
		textStyle: {
			color: theme.fontColor,
			fontSize: theme.fontSize,
			lineHeight: theme.fontSize,
			fontWeight: theme.fontBold
		}
	};
};

export const isDimensionValid = (dimension: ChartSettingsDimension): boolean => !!dimension.column;
export const asDimensionData = (dimension: ChartSettingsDimension, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = dimension;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getDimensionValue = (row: any, dimension: ChartSettingsDimension) => {
	const { column: { name: propName } = { name: '' } } = dimension;
	return row[propName];
};
export const getDimensionLabel = (dimension: ChartSettingsDimension) => {
	return dimension.label || dimension.column?.label || dimension.column?.name;
};

export const isIndicatorValid = (indicator: ChartSettingsIndicator): boolean => !!indicator.column;
export const asIndicatorData = (indicator: ChartSettingsIndicator, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = indicator;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getIndicatorLabel = (indicator: ChartSettingsIndicator) => {
	return indicator.label || indicator.column?.label || indicator.column?.name;
};

export const buildSingleXAxis = (options: { data: DataSet, dimension: ChartSettingsDimension }) => {
	const { data, dimension } = options;
	const type = detectDimensionCategory(dimension);
	return {
		type: detectDimensionCategory(dimension),
		name: getDimensionLabel(dimension),
		data: type === ChartAxisType.CATEGORY ? asDimensionData(dimension, data) : undefined
	};
};

/**
 * build x-axis definition. return only one axis anyway. use descartes to combine all dimensions.
 */
export const buildXAxis = (options: { data: DataSet, dimensions: Array<ChartSettingsDimension> }) => {
	const { data, dimensions } = options;
	if (dimensions.length === 1) {
		return buildSingleXAxis({ data, dimension: dimensions[0] });
	}

	const dimensionValues = dimensions.map(d => asDimensionData(d, data));

	return {
		type: ChartAxisType.CATEGORY,
		name: dimensions.map(d => getDimensionLabel(d)).join(', '),
		// descartes
		data: dimensionValues.reduce((radix, values) => {
			if (radix.length === 0) {
				// use me as radix for next loop
				return values.map(v => `${v}`);
			}

			// derive on radix
			return radix.map(r => {
				return values.map(v => `${r}, ${v}`);
			}).flat();
		}, [] as Array<string>)
	};
};

export const getXAxisValue = (options: { data: DataSet, row: any, dimensions: Array<ChartSettingsDimension> }) => {
	//TODO assume all dimension can be found in given row data now
	// in real world, they might be found via relationships and other topics
	const { row, dimensions } = options;
	return dimensions.map(d => getDimensionValue(row, d)).join(', ');
};

export type YAxisSeriesDataItem = Array<any>;
export type YAxisSeriesData = Array<YAxisSeriesDataItem>;
const count = (items: Array<YAxisSeriesDataItem>): YAxisSeriesDataItem => {
	const [ key, , , label ] = items[0];
	const final = items.reduce((final) => final + 1, 0);
	return [ key, final, `${label}: ${final}`, label ];
};
const sum = (items: Array<YAxisSeriesDataItem>): YAxisSeriesDataItem => {
	const [ key, , , label ] = items[0];
	const final = items.reduce((final, item) => (final || 0) + (item[1] || 0), 0);
	return [ key, final, `${label}: ${final}`, label ];
};
const avg = (items: Array<YAxisSeriesDataItem>): YAxisSeriesDataItem => {
	const [ key, , , label ] = items[0];
	const final = items.reduce((final, item) => (final || 0) + (item[1] || 0), 0) / items.length;
	return [ key, final, `${label}: ${final}`, label ];
};
const med = (items: Array<YAxisSeriesDataItem>): YAxisSeriesDataItem => {
	const [ key, , , label ] = items[0];
	const sorted = items.sort((a: YAxisSeriesDataItem, b: YAxisSeriesDataItem): number => {
		if (a[1] == null) {
			return b[1] == null ? 0 : -1;
		} else if (b[1] == null) {
			return 1;
		} else {
			const minus = (a[1] || 0) - (b[1] || 0);
			if (isNaN(minus)) {
				const x = (a[1] || '').toString();
				const y = (b[1] || '').toString();
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
	return [ key, final, `${label}: ${final}`, label ];
};
const max = (items: Array<YAxisSeriesDataItem>, indicator: ChartSettingsIndicator): YAxisSeriesDataItem => {
	const [ key, value, , label ] = items[0];
	const final = items.reduce((final, item) => {
		if (indicator.column?.type === DataColumnType.NUMERIC) {
			return ((final || 0) - (item[1] || 0) < 0) ? (item[1] || 0) : (final || 0);
		} else {
			// date, datetime, time
			if (final == null) {
				return item[1];
			} else if (item[1] == null) {
				return final;
			} else {
				const a = dayjs(final);
				const b = dayjs(item[1]);
				return a.isBefore(b) ? item[1] : final;
			}
		}
	}, value);
	return [ key, final, `${label}: ${final}`, label ];
};
const min = (items: Array<YAxisSeriesDataItem>, indicator: ChartSettingsIndicator): YAxisSeriesDataItem => {
	const [ key, value, , label ] = items[0];
	const final = items.reduce((final, item) => {
		if (indicator.column?.type === DataColumnType.NUMERIC) {
			return ((final || 0) - (item[1] || 0) > 0) ? (item[1] || 0) : (final || 0);
		} else {
			// date, datetime, time
			if (final == null) {
				return item[1];
			} else if (item[1] == null) {
				return final;
			} else {
				const a = dayjs(final);
				const b = dayjs(item[1]);
				return a.isBefore(b) ? final : item[1];
			}
		}
	}, value);
	console.log(final);
	return [ key, final, `${label}: ${final}`, label ];
};

export const getYAxisSeriesData = (options: {
	data: DataSet,
	indicator: ChartSettingsIndicator,
	dimensions: Array<ChartSettingsDimension>,
}): YAxisSeriesData => {
	const { data, indicator, dimensions } = options;

	const seriesData: Array<YAxisSeriesDataItem> = (data[indicator.topicName!].data || []).map(item => {
		const label = getIndicatorLabel(indicator);
		const column = indicator.column!;
		const value = item[column.name!];
		return [
			// xAxis
			getXAxisValue({ data, dimensions, row: item }),
			// yAxis
			value,
			`${label}: ${value}`,
			label
		] as YAxisSeriesDataItem;
	});

	let aggregate: (((items: Array<YAxisSeriesDataItem>, indicator: ChartSettingsIndicator) => YAxisSeriesDataItem) | null) = null;
	switch (indicator.aggregator) {
		case IndicatorAggregator.COUNT:
			aggregate = count;
			break;
		case IndicatorAggregator.SUMMARY:
			aggregate = sum;
			break;
		case IndicatorAggregator.AVERAGE:
			aggregate = avg;
			break;
		case IndicatorAggregator.MEDIAN:
			aggregate = med;
			break;
		case IndicatorAggregator.MAXIMUM:
			aggregate = max;
			break;
		case IndicatorAggregator.MINIMUM:
			aggregate = min;
			break;
		case IndicatorAggregator.NONE:
		default:
			break;
	}

	if (aggregate == null) {
		return seriesData;
	} else {
		const map = seriesData.reduce((map, item) => {
			const [ key ] = item;
			if (map.has(key)) {
				map.get(key)!.push(item);
			} else {
				map.set(key, [ item ]);
			}
			return map;
		}, new Map<string, Array<YAxisSeriesDataItem>>());

		return Array.from(map.values()).map(values => aggregate!(values, indicator));
	}
};