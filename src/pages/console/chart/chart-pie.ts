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

export const PIE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.PIE,
	name: 'Pie',
	maxIndicatorCount: 1,
	buildOptions: (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => {
		// only one indicator allowed
		const { indicators: [ indicator ] } = chart;

		const groups = buildDescartesByDimensions(chart, dataset);
		const factor = findFactorByIndicator(space, indicator);

		return {
			color: BaseColors24,
			tooltip: {
				trigger: 'item'
			},
			legend: { data: groups.map(({ value }) => value) },
			series: [ {
				name: factor.label || factor.name,
				type: 'pie',
				center: [ '50%', '50%' ],
				data: groups.map(({ value, row }) => {
					return {
						name: value,
						value: row[0] || 0
					};
				})
			} ]
		};
	}
};