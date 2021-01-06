import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildTreeData } from './chart-utils';
import { ChartTypeDefinition } from './types';

export const TREE: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.TREE,
	name: 'Tree',
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
				type: 'tree',
				top: '2%',
				left: '2%',
				bottom: '2%',
				right: '2%',
				symbolSize: 8,
				label: {
					position: 'right',
					verticalAlign: 'middle',
					align: 'left'
				},
				leaves: {
					label: {
						position: 'left',
						verticalAlign: 'middle',
						align: 'right'
					}
				},
				expandAndCollapse: true,
				data: buildTreeData(chart, dataset)
			} ]
		};
	}
};
