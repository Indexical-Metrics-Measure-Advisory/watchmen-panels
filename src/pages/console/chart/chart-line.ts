import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildDescartesByDimensions } from './chart-utils';
import { ChartTypeDefinition } from './types';
import { findFactorByIndicator } from './utils';

export const LINE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.LINE,
	name: 'Line',
	minDimensionCount: 1,
	minIndicatorCount: 1,
	buildOptions: (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => {
		const { indicators } = chart;

		const legends = indicators.map((indicator, indicatorIndex) => {
			const factor = findFactorByIndicator(space, indicator);
			return { label: factor.label || factor.name, indicator, index: indicatorIndex };
		});
		const groups = buildDescartesByDimensions(chart, dataset);
		return {
			color: BaseColors24,
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			legend: { data: legends.map(item => item.label) },
			xAxis: [ {
				type: 'category',
				axisTick: { show: false },
				data: groups.map(({ value }) => value)
			} ],
			yAxis: [ { type: 'value' } ],
			series: legends.map(({ label, index: indicatorIndex }) => {
				return {
					name: label,
					type: 'line',
					barGap: 0,
					label: {
						show: true,
						position: 'insideTop',
						distance: 15,
						verticalAlign: 'middle',
						rotate: 0
					},
					data: groups.map(({ row }) => row[indicatorIndex])
				};
			})
		};
	}
};
