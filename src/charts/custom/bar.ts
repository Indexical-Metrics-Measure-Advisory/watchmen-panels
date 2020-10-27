import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { ChartAxisType, ChartBarDefinition, ChartKey, ChartOptions, ChartSettings } from './types';
import {
	asIndicatorData,
	buildTitle,
	buildXAxis,
	detectIndicatorCategory,
	getIndicatorLabel,
	getXAxisValue,
	isDimensionValid,
	isIndicatorValid
} from './utils';

const buildOptions = (params: {
	data: DataSet,
	theme: Theme,
	settings: ChartSettings
}): ChartOptions => {
	const { data, theme, settings: { title, dimensions, indicators } } = params;

	const validDimensions = dimensions.filter(isDimensionValid);
	const validIndicators = indicators.filter(isIndicatorValid);

	const xAxis = {
		...buildXAxis({ data, dimensions: validDimensions }),
		axisLabel: {
			// force show all
			interval: 0
		}
	};
	const series = validIndicators.map(indicator => {
		return {
			type: 'bar',
			encode: {
				x: 0,
				y: 1
			},
			data: (data[indicator.topicName!].data || []).map(item => {
				const label = getIndicatorLabel(indicator);
				const value = item[indicator.column!.name!];
				return [
					// xAxis
					getXAxisValue({ data, dimensions: validDimensions, row: item }),
					// yAxis
					value,
					`${label}: ${value}`
				];
			})
		};
	});
	if (xAxis.type === ChartAxisType.CATEGORY && validDimensions.length !== 1 && xAxis.data) {
		// compound dimensions
		// remove the nonexistent categories
		const map = series.reduce((map, s) => {
			// index 0 in series value is a-axis category value
			(s.data || []).forEach(v => map.set(v[0] as unknown as string, true));
			return map;
		}, new Map<string, boolean>());
		xAxis.data = xAxis.data.filter(v => map.get(v as unknown as string));
	}

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
				return `${values[0]}<br>${values[values.length - 1]}`;
			}
		},
		xAxis,
		yAxis: validIndicators.map(indicator => {
			const type = detectIndicatorCategory(indicator);
			return {
				type,
				name: getIndicatorLabel(indicator),
				data: type === ChartAxisType.CATEGORY ? asIndicatorData(indicator, data) : undefined
			};
		}),
		series
	};
};

export const Bar: ChartBarDefinition = {
	name: 'Bar',
	key: ChartKey.BAR,
	buildOptions
};