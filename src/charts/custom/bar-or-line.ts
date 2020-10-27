import { DataSet } from '../../data/types';
import { Theme } from '../../theme/types';
import { BaseColors24 } from '../color-theme';
import { ChartAxisType, ChartOptions, ChartSettings } from './types';
import {
	asIndicatorData,
	buildTitle,
	buildXAxis,
	detectIndicatorCategory,
	getIndicatorLabel,
	getYAxisSeriesData,
	isDimensionValid,
	isIndicatorValid
} from './utils';

export const buildOptionsForBarOrLine = (defaultType: 'bar' | 'line') => (params: {
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
			type: defaultType,
			encode: {
				x: 0,
				y: 1
			},
			data: getYAxisSeriesData({ data, indicator, dimensions: validDimensions })
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
				return `${values[0]}<br>${values[values.length - 2]}`;
			}
		},
		xAxis,
		yAxis: validIndicators.map(indicator => {
			const type = detectIndicatorCategory(indicator);
			const axisData = type === ChartAxisType.CATEGORY ? asIndicatorData(indicator, data) : undefined;
			return {
				type,
				name: getIndicatorLabel(indicator),
				data: axisData
			};
		}),
		series
	};
};
