import { BaseColors24 } from '../../../charts/color-theme';
import {
	ConsoleSpace,
	ConsoleSpaceSubjectChart,
	ConsoleSpaceSubjectChartDataSet,
	ConsoleSpaceSubjectChartDataSetGrid,
	ConsoleSpaceSubjectChartType
} from '../../../services/console/types';
import { getDimensionColumnIndexOffset } from './chart-utils';
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
		// only one indicator allowed
		const { dimensions } = chart;

		const dimensionColumnIndexOffset = getDimensionColumnIndexOffset(chart);
		const buildData = (dimensionIndex: number, grid: ConsoleSpaceSubjectChartDataSetGrid): Array<SunburstSeriesNonLeafNode> => {
			const dimensionValueMap = new Map<string, number>();
			return grid.reduce<Array<SunburstItem>>((data, row) => {
				const dimensionValue = `${row[dimensionIndex + dimensionColumnIndexOffset] || ''}`;
				const dimensionValueIndex = dimensionValueMap.get(dimensionValue);
				if (!dimensionValueIndex) {
					data.push({ name: dimensionValue, children: [ row ] });
					dimensionValueMap.set(dimensionValue, data.length);
				} else {
					data[dimensionValueIndex].children.push(row);
				}
				return data;
			}, [] as Array<SunburstItem>).map(({ name, children }) => {
				if (dimensionIndex === dimensions.length - 2) {
					// all dimensions done, start to process indicator
					return {
						name,
						children: children.map(row => {
							return {
								name: `${row[dimensionIndex + 1 + dimensionColumnIndexOffset]}`,
								value: row[0]
							} as SunburstSeriesLeafNode;
						})
					};
				} else {
					// next dimension
					return { name, children: buildData(dimensionIndex + 1, children) };
				}
			});
		};

		return {
			color: BaseColors24,
			tooltip: {
				trigger: 'item'
			},
			series: [ {
				type: 'sunburst',
				radius: [ '10%', '90%' ],
				data: buildData(0, dataset.data)
			} ]
		};
	}
};
