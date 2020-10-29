import { DataSet } from '../../../data/types';
import { ChartSettingsDimension, ChartSettingsIndicator, SeriesData, SeriesDataItem } from '../types';
import { aggregate } from './aggregator';
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