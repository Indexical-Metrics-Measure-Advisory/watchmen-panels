import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { ChartTypeDefinition } from './chart-defender';
import { findFactorByIndicator } from './utils';

const buildDescartesByDimensions = (chart: ConsoleSpaceSubjectChart, dataset: ConsoleSpaceSubjectChartDataSet) => {
	const { data } = dataset;
	const { dimensions, indicators } = chart;

	const columnIndexOffset = indicators.length;
	const dimensionIndexes = new Array(dimensions.length).fill(1).map((v, index) => index + columnIndexOffset);
	return data.map(row => {
		return { value: dimensionIndexes.map(index => row[index]).join(','), row };
	});
};
export const BAR: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.BAR,
	name: 'Bar',
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
					type: 'bar',
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
