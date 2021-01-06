import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildTreeData } from './chart-utils';
import { ChartTypeDefinition } from './types';

export const TREEMAP: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.TREEMAP,
	name: 'Treemap',
	minDimensionCount: 2,
	minIndicatorCount: 1,
	maxIndicatorCount: 1,
	buildOptions: (chart: ConsoleSpaceSubjectChart, space: ConsoleSpace, dataset: ConsoleSpaceSubjectChartDataSet) => {
		return {
			color: BaseColors24,
			tooltip: {
				trigger: 'item'
			},
			series: [ {
				name: chart.name,
				type: 'treemap',
				leafDepth: 1,
				data: buildTreeData(chart, dataset)
			} ]
		};
	}
};
