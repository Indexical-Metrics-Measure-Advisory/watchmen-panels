import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import {
	ChartAxisType,
	ChartBarDefinition,
	ChartKey,
	ChartOptions,
	ChartSettings,
	ChartSettingsDimension,
	ChartSettingsIndicator
} from './types';
import { buildTitle, detectDimensionCategory, detectIndicatorCategory } from './utils';

const isDimensionValid = (dimension: ChartSettingsDimension): boolean => !!dimension.column;
const asDimensionData = (dimension: ChartSettingsDimension, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = dimension;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
const getDimensionValue = (row: any, dimension: ChartSettingsDimension) => {
	const { column: { name: propName } = { name: '' } } = dimension;
	return row[propName];
};

const isIndicatorValid = (indicator: ChartSettingsIndicator): boolean => !!indicator.column;
const asIndicatorData = (indicator: ChartSettingsIndicator, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = indicator;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
const getIndicatorLabel = (indicator: ChartSettingsIndicator) => {
	return indicator.label || indicator.column?.label || indicator.column?.name;
};

const buildOptions = (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const validDimensions = dimensions.filter(isDimensionValid);
	const validIndicators = indicators.filter(isIndicatorValid);

	return {
		title: buildTitle({ title, theme }),
		color: BaseColors24,
		grid: {
			top: 64,
			bottom: 64,
			containLabel: true
		},
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				const values: Array<any> = params.value;
				return values[values.length - 1];
			}
		},
		xAxis: validDimensions.map(dimension => {
			const type = detectDimensionCategory(dimension);
			return {
				type: detectDimensionCategory(dimension),
				name: dimension.label || dimension.column?.label || dimension.column?.name,
				data: type === ChartAxisType.CATEGORY ? asDimensionData(dimension, data) : undefined
			};
		}),
		yAxis: validIndicators.map(indicator => {
			const type = detectIndicatorCategory(indicator);
			return {
				type,
				name: getIndicatorLabel(indicator),
				data: type === ChartAxisType.CATEGORY ? asIndicatorData(indicator, data) : undefined
			};
		}),
		series: validIndicators.map(indicator => {
			return {
				type: 'bar',
				encode: {
					x: validDimensions.map((x, index) => index),
					y: validDimensions.length
				},
				data: (data[indicator.topicName!].data || []).map(item => {
					const label = getIndicatorLabel(indicator);
					const value = item[indicator.column!.name!];
					return [
						// xAxis
						...(validDimensions.map(dimension => getDimensionValue(item, dimension))),
						// yAxis
						value,
						`${label}: ${value}`
					];
				})
			};
		})
	};
};

export const Bar: ChartBarDefinition = {
	name: 'Bar',
	key: ChartKey.BAR,
	buildOptions
};