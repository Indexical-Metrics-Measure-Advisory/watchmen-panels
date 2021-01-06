import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartDataSetGrid,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { buildTreeData } from './chart-utils';
import { ChartTypeDefinition } from './types';

interface SunburstItem {
	name: string,
	children: ConsoleSpaceSubjectChartDataSetGrid
}

interface SunburstSeriesNode {
	name: string;
}

interface SunburstSeriesNonLeafNode extends SunburstSeriesNode {
	children: Array<SunburstSeriesNode>;
}

interface SunburstSeriesLeafNode extends SunburstSeriesNode {
	value: number;
}

export const SUNBURST: ChartTypeDefinition = {
	type: ConsoleSpaceSubjectChartType.SUNBURST,
	name: 'Sunburst',
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
				type: 'sunburst',
				radius: [ '10%', '90%' ],
				data: buildTreeData(chart, dataset)
			} ]
		};
	}
};
